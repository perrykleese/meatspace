use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};

declare_id!("FgoqpRZt3W2eYK5Cw96RgmjUeUAitV1ZoGjhduF5qfVp");

/// MEATSPACE Protocol - A marketplace where AI agents hire humans for physical-world tasks
/// Token: $MEAT (H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy)

#[program]
pub mod meatspace {
    use super::*;

    // ============================================================================
    // AGENT MANAGEMENT
    // ============================================================================

    /// Register a new AI agent that can create and fund tasks
    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        name: String,
        metadata_uri: String,
    ) -> Result<()> {
        require!(name.len() <= 32, MeatspaceError::NameTooLong);
        require!(metadata_uri.len() <= 200, MeatspaceError::UriTooLong);

        let agent = &mut ctx.accounts.agent;
        agent.authority = ctx.accounts.authority.key();
        agent.name = name;
        agent.metadata_uri = metadata_uri;
        agent.tasks_created = 0;
        agent.tasks_completed = 0;
        agent.total_spent = 0;
        agent.reputation_score = 100; // Start with neutral reputation
        agent.created_at = Clock::get()?.unix_timestamp;
        agent.bump = ctx.bumps.agent;

        emit!(AgentRegistered {
            agent: agent.key(),
            authority: agent.authority,
            name: agent.name.clone(),
        });

        Ok(())
    }

    /// Update agent metadata
    pub fn update_agent(
        ctx: Context<UpdateAgent>,
        name: Option<String>,
        metadata_uri: Option<String>,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;

        if let Some(n) = name {
            require!(n.len() <= 32, MeatspaceError::NameTooLong);
            agent.name = n;
        }

        if let Some(uri) = metadata_uri {
            require!(uri.len() <= 200, MeatspaceError::UriTooLong);
            agent.metadata_uri = uri;
        }

        Ok(())
    }

    // ============================================================================
    // WORKER MANAGEMENT
    // ============================================================================

    /// Register a new human worker who can claim and complete tasks
    pub fn register_worker(
        ctx: Context<RegisterWorker>,
        name: String,
        skills: Vec<String>,
        location_hash: [u8; 32], // Privacy-preserving location commitment
    ) -> Result<()> {
        require!(name.len() <= 32, MeatspaceError::NameTooLong);
        require!(skills.len() <= 10, MeatspaceError::TooManySkills);

        let worker = &mut ctx.accounts.worker;
        worker.authority = ctx.accounts.authority.key();
        worker.name = name;
        worker.skills = skills;
        worker.location_hash = location_hash;
        worker.tasks_completed = 0;
        worker.tasks_disputed = 0;
        worker.total_earned = 0;
        worker.reputation_score = 100;
        worker.is_active = true;
        worker.created_at = Clock::get()?.unix_timestamp;
        worker.bump = ctx.bumps.worker;

        emit!(WorkerRegistered {
            worker: worker.key(),
            authority: worker.authority,
            name: worker.name.clone(),
        });

        Ok(())
    }

    /// Update worker profile
    pub fn update_worker(
        ctx: Context<UpdateWorker>,
        name: Option<String>,
        skills: Option<Vec<String>>,
        location_hash: Option<[u8; 32]>,
        is_active: Option<bool>,
    ) -> Result<()> {
        let worker = &mut ctx.accounts.worker;

        if let Some(n) = name {
            require!(n.len() <= 32, MeatspaceError::NameTooLong);
            worker.name = n;
        }

        if let Some(s) = skills {
            require!(s.len() <= 10, MeatspaceError::TooManySkills);
            worker.skills = s;
        }

        if let Some(loc) = location_hash {
            worker.location_hash = loc;
        }

        if let Some(active) = is_active {
            worker.is_active = active;
        }

        Ok(())
    }

    // ============================================================================
    // TASK LIFECYCLE
    // ============================================================================

    /// Create a new task with MEAT tokens escrowed
    pub fn create_task(
        ctx: Context<CreateTask>,
        task_id: u64,
        title: String,
        description: String,
        required_skills: Vec<String>,
        location_requirement: Option<[u8; 32]>,
        reward_amount: u64,
        deadline: i64,
        max_workers: u8,
    ) -> Result<()> {
        require!(title.len() <= 64, MeatspaceError::TitleTooLong);
        require!(description.len() <= 500, MeatspaceError::DescriptionTooLong);
        require!(required_skills.len() <= 5, MeatspaceError::TooManySkills);
        require!(reward_amount > 0, MeatspaceError::InvalidRewardAmount);
        require!(max_workers > 0 && max_workers <= 10, MeatspaceError::InvalidMaxWorkers);
        
        let clock = Clock::get()?;
        require!(deadline > clock.unix_timestamp, MeatspaceError::DeadlineInPast);

        // Transfer MEAT tokens to escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.agent_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, reward_amount)?;

        // Initialize task
        let task = &mut ctx.accounts.task;
        task.task_id = task_id;
        task.agent = ctx.accounts.agent.key();
        task.title = title;
        task.description = description;
        task.required_skills = required_skills;
        task.location_requirement = location_requirement;
        task.reward_amount = reward_amount;
        task.deadline = deadline;
        task.max_workers = max_workers;
        task.current_workers = 0;
        task.status = TaskStatus::Open;
        task.created_at = clock.unix_timestamp;
        task.bump = ctx.bumps.task;

        // Initialize escrow
        let escrow = &mut ctx.accounts.escrow;
        escrow.task = task.key();
        escrow.amount = reward_amount;
        escrow.token_account = ctx.accounts.escrow_token_account.key();
        escrow.bump = ctx.bumps.escrow;

        // Update agent stats
        let agent = &mut ctx.accounts.agent;
        agent.tasks_created = agent.tasks_created.checked_add(1).unwrap();

        emit!(TaskCreated {
            task: task.key(),
            agent: agent.key(),
            title: task.title.clone(),
            reward_amount,
            deadline,
        });

        Ok(())
    }

    /// Worker claims a task to work on it
    pub fn claim_task(ctx: Context<ClaimTask>) -> Result<()> {
        let task = &mut ctx.accounts.task;
        let worker = &ctx.accounts.worker;

        // Validate task state
        require!(task.status == TaskStatus::Open, MeatspaceError::TaskNotOpen);
        require!(worker.is_active, MeatspaceError::WorkerNotActive);
        require!(
            task.current_workers < task.max_workers,
            MeatspaceError::TaskFullyClaimed
        );

        // Check deadline hasn't passed
        let clock = Clock::get()?;
        require!(clock.unix_timestamp < task.deadline, MeatspaceError::TaskExpired);

        // Initialize task assignment
        let assignment = &mut ctx.accounts.task_assignment;
        assignment.task = task.key();
        assignment.worker = worker.key();
        assignment.claimed_at = clock.unix_timestamp;
        assignment.status = AssignmentStatus::InProgress;
        assignment.proof_uri = String::new();
        assignment.proof_submitted_at = 0;
        assignment.bump = ctx.bumps.task_assignment;

        // Update task
        task.current_workers = task.current_workers.checked_add(1).unwrap();
        if task.current_workers >= task.max_workers {
            task.status = TaskStatus::InProgress;
        }

        emit!(TaskClaimed {
            task: task.key(),
            worker: worker.key(),
            claimed_at: assignment.claimed_at,
        });

        Ok(())
    }

    /// Worker submits proof of task completion
    pub fn submit_proof(
        ctx: Context<SubmitProof>,
        proof_uri: String,
        proof_hash: [u8; 32],
    ) -> Result<()> {
        require!(proof_uri.len() <= 200, MeatspaceError::UriTooLong);

        let task = &ctx.accounts.task;
        let assignment = &mut ctx.accounts.task_assignment;

        // Validate state
        require!(
            task.status == TaskStatus::Open || task.status == TaskStatus::InProgress,
            MeatspaceError::TaskNotClaimable
        );
        require!(
            assignment.status == AssignmentStatus::InProgress,
            MeatspaceError::InvalidAssignmentStatus
        );

        // Check deadline
        let clock = Clock::get()?;
        require!(clock.unix_timestamp < task.deadline, MeatspaceError::TaskExpired);

        // Update assignment
        assignment.proof_uri = proof_uri.clone();
        assignment.proof_hash = proof_hash;
        assignment.proof_submitted_at = clock.unix_timestamp;
        assignment.status = AssignmentStatus::ProofSubmitted;

        emit!(ProofSubmitted {
            task: task.key(),
            worker: ctx.accounts.worker.key(),
            proof_uri,
            proof_hash,
        });

        Ok(())
    }

    /// Agent verifies proof and releases payment to worker
    pub fn verify_and_pay(ctx: Context<VerifyAndPay>, rating: u8) -> Result<()> {
        require!(rating >= 1 && rating <= 5, MeatspaceError::InvalidRating);

        let task = &mut ctx.accounts.task;
        let assignment = &mut ctx.accounts.task_assignment;
        let worker = &mut ctx.accounts.worker;
        let agent = &mut ctx.accounts.agent;
        let escrow = &ctx.accounts.escrow;

        // Validate state
        require!(
            assignment.status == AssignmentStatus::ProofSubmitted,
            MeatspaceError::ProofNotSubmitted
        );

        // Calculate payment (equal split among workers for simplicity)
        let payment_per_worker = task.reward_amount
            .checked_div(task.max_workers as u64)
            .unwrap();

        // Transfer from escrow to worker
        let task_key = task.key();
        let seeds = &[
            b"escrow",
            task_key.as_ref(),
            &[escrow.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.worker_token_account.to_account_info(),
            authority: ctx.accounts.escrow.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, payment_per_worker)?;

        // Update assignment
        assignment.status = AssignmentStatus::Completed;
        assignment.rating = rating;

        // Update worker stats
        worker.tasks_completed = worker.tasks_completed.checked_add(1).unwrap();
        worker.total_earned = worker.total_earned.checked_add(payment_per_worker).unwrap();
        
        // Update reputation based on rating (simple linear adjustment)
        let reputation_delta: i16 = (rating as i16 - 3) * 5; // -10 to +10
        worker.reputation_score = (worker.reputation_score as i16 + reputation_delta)
            .max(0)
            .min(200) as u16;

        // Update agent stats
        agent.tasks_completed = agent.tasks_completed.checked_add(1).unwrap();
        agent.total_spent = agent.total_spent.checked_add(payment_per_worker).unwrap();

        // Check if all assignments are complete
        // Note: In production, you'd track this more elegantly
        task.status = TaskStatus::Completed;

        emit!(TaskVerified {
            task: task.key(),
            worker: worker.key(),
            payment: payment_per_worker,
            rating,
        });

        Ok(())
    }

    /// Raise a dispute on a task assignment
    pub fn dispute(
        ctx: Context<RaiseDispute>,
        reason: String,
        evidence_uri: String,
    ) -> Result<()> {
        require!(reason.len() <= 500, MeatspaceError::DescriptionTooLong);
        require!(evidence_uri.len() <= 200, MeatspaceError::UriTooLong);

        let task = &mut ctx.accounts.task;
        let assignment = &mut ctx.accounts.task_assignment;

        // Can only dispute if proof submitted or in progress
        require!(
            assignment.status == AssignmentStatus::InProgress ||
            assignment.status == AssignmentStatus::ProofSubmitted,
            MeatspaceError::CannotDispute
        );

        let clock = Clock::get()?;

        // Initialize dispute
        let dispute = &mut ctx.accounts.dispute;
        dispute.task = task.key();
        dispute.assignment = assignment.key();
        dispute.initiator = ctx.accounts.authority.key();
        dispute.reason = reason;
        dispute.evidence_uri = evidence_uri;
        dispute.status = DisputeStatus::Open;
        dispute.created_at = clock.unix_timestamp;
        dispute.resolved_at = 0;
        dispute.resolution = None;
        dispute.bump = ctx.bumps.dispute;

        // Update states
        assignment.status = AssignmentStatus::Disputed;
        task.status = TaskStatus::Disputed;

        // Update worker dispute count
        let worker = &mut ctx.accounts.worker;
        worker.tasks_disputed = worker.tasks_disputed.checked_add(1).unwrap();

        emit!(DisputeRaised {
            dispute: dispute.key(),
            task: task.key(),
            initiator: dispute.initiator,
            reason: dispute.reason.clone(),
        });

        Ok(())
    }

    /// Resolve a dispute (requires protocol authority in production)
    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        resolution: DisputeResolution,
        notes: String,
    ) -> Result<()> {
        let dispute = &mut ctx.accounts.dispute;
        let task = &mut ctx.accounts.task;
        let assignment = &mut ctx.accounts.task_assignment;
        let escrow = &ctx.accounts.escrow;

        require!(dispute.status == DisputeStatus::Open, MeatspaceError::DisputeNotOpen);

        let clock = Clock::get()?;
        dispute.status = DisputeStatus::Resolved;
        dispute.resolved_at = clock.unix_timestamp;
        dispute.resolution = Some(resolution.clone());
        dispute.resolution_notes = notes;

        let task_key = task.key();
        let seeds = &[
            b"escrow",
            task_key.as_ref(),
            &[escrow.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        match resolution {
            DisputeResolution::WorkerFavored => {
                // Pay the worker
                let payment_per_worker = task.reward_amount
                    .checked_div(task.max_workers as u64)
                    .unwrap();

                let cpi_accounts = Transfer {
                    from: ctx.accounts.escrow_token_account.to_account_info(),
                    to: ctx.accounts.worker_token_account.to_account_info(),
                    authority: ctx.accounts.escrow.to_account_info(),
                };
                let cpi_ctx = CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    cpi_accounts,
                    signer_seeds,
                );
                token::transfer(cpi_ctx, payment_per_worker)?;

                assignment.status = AssignmentStatus::Completed;
                
                let worker = &mut ctx.accounts.worker;
                worker.tasks_completed = worker.tasks_completed.checked_add(1).unwrap();
                worker.total_earned = worker.total_earned.checked_add(payment_per_worker).unwrap();
            }
            DisputeResolution::AgentFavored => {
                // Return funds to agent
                let payment_per_worker = task.reward_amount
                    .checked_div(task.max_workers as u64)
                    .unwrap();

                let cpi_accounts = Transfer {
                    from: ctx.accounts.escrow_token_account.to_account_info(),
                    to: ctx.accounts.agent_token_account.to_account_info(),
                    authority: ctx.accounts.escrow.to_account_info(),
                };
                let cpi_ctx = CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    cpi_accounts,
                    signer_seeds,
                );
                token::transfer(cpi_ctx, payment_per_worker)?;

                assignment.status = AssignmentStatus::Cancelled;
                
                // Penalize worker reputation
                let worker = &mut ctx.accounts.worker;
                worker.reputation_score = worker.reputation_score.saturating_sub(20);
            }
            DisputeResolution::Split => {
                // Split 50/50
                let payment_per_worker = task.reward_amount
                    .checked_div(task.max_workers as u64)
                    .unwrap();
                let half = payment_per_worker.checked_div(2).unwrap();

                // Pay worker half
                let cpi_accounts = Transfer {
                    from: ctx.accounts.escrow_token_account.to_account_info(),
                    to: ctx.accounts.worker_token_account.to_account_info(),
                    authority: ctx.accounts.escrow.to_account_info(),
                };
                let cpi_ctx = CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    cpi_accounts,
                    signer_seeds,
                );
                token::transfer(cpi_ctx, half)?;

                // Return half to agent
                let cpi_accounts2 = Transfer {
                    from: ctx.accounts.escrow_token_account.to_account_info(),
                    to: ctx.accounts.agent_token_account.to_account_info(),
                    authority: ctx.accounts.escrow.to_account_info(),
                };
                let cpi_ctx2 = CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    cpi_accounts2,
                    signer_seeds,
                );
                token::transfer(cpi_ctx2, half)?;

                assignment.status = AssignmentStatus::Completed;
            }
        }

        task.status = TaskStatus::Completed;

        emit!(DisputeResolved {
            dispute: dispute.key(),
            resolution,
        });

        Ok(())
    }

    /// Cancel a task and return funds (only if no claims or before deadline with no submissions)
    pub fn cancel_task(ctx: Context<CancelTask>) -> Result<()> {
        let task = &mut ctx.accounts.task;
        let escrow = &ctx.accounts.escrow;
        let agent = &mut ctx.accounts.agent;

        // Can only cancel if open and no workers claimed, or deadline passed with no submissions
        let clock = Clock::get()?;
        let can_cancel = task.status == TaskStatus::Open && task.current_workers == 0;
        let deadline_passed = clock.unix_timestamp >= task.deadline;
        
        require!(
            can_cancel || (deadline_passed && task.status != TaskStatus::Completed),
            MeatspaceError::CannotCancel
        );

        // Return funds to agent
        let task_key = task.key();
        let seeds = &[
            b"escrow",
            task_key.as_ref(),
            &[escrow.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.agent_token_account.to_account_info(),
            authority: ctx.accounts.escrow.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, escrow.amount)?;

        task.status = TaskStatus::Cancelled;

        emit!(TaskCancelled {
            task: task.key(),
            agent: agent.key(),
            refunded: escrow.amount,
        });

        Ok(())
    }

    /// Worker abandons a claimed task
    pub fn abandon_task(ctx: Context<AbandonTask>) -> Result<()> {
        let task = &mut ctx.accounts.task;
        let assignment = &mut ctx.accounts.task_assignment;
        let worker = &mut ctx.accounts.worker;

        require!(
            assignment.status == AssignmentStatus::InProgress,
            MeatspaceError::InvalidAssignmentStatus
        );

        assignment.status = AssignmentStatus::Abandoned;
        task.current_workers = task.current_workers.saturating_sub(1);
        
        // Reopen task if it was in progress
        if task.status == TaskStatus::InProgress && task.current_workers < task.max_workers {
            task.status = TaskStatus::Open;
        }

        // Slight reputation penalty for abandoning
        worker.reputation_score = worker.reputation_score.saturating_sub(5);

        emit!(TaskAbandoned {
            task: task.key(),
            worker: worker.key(),
        });

        Ok(())
    }
}

// ============================================================================
// ACCOUNT STRUCTURES
// ============================================================================

#[account]
#[derive(Default)]
pub struct Agent {
    /// Wallet that controls this agent
    pub authority: Pubkey,
    /// Display name
    pub name: String,
    /// Off-chain metadata URI (avatar, description, etc.)
    pub metadata_uri: String,
    /// Total tasks created
    pub tasks_created: u64,
    /// Total tasks successfully completed
    pub tasks_completed: u64,
    /// Total MEAT tokens spent
    pub total_spent: u64,
    /// Reputation score (0-200, starts at 100)
    pub reputation_score: u16,
    /// Unix timestamp of registration
    pub created_at: i64,
    /// PDA bump
    pub bump: u8,
}

impl Agent {
    pub const MAX_SIZE: usize = 32 + // authority
        4 + 32 + // name (string prefix + max chars)
        4 + 200 + // metadata_uri
        8 + // tasks_created
        8 + // tasks_completed
        8 + // total_spent
        2 + // reputation_score
        8 + // created_at
        1 + // bump
        64; // padding
}

#[account]
#[derive(Default)]
pub struct Worker {
    /// Wallet that controls this worker
    pub authority: Pubkey,
    /// Display name
    pub name: String,
    /// Skills this worker has
    pub skills: Vec<String>,
    /// Privacy-preserving location commitment
    pub location_hash: [u8; 32],
    /// Total tasks completed
    pub tasks_completed: u64,
    /// Total disputed tasks
    pub tasks_disputed: u64,
    /// Total MEAT tokens earned
    pub total_earned: u64,
    /// Reputation score (0-200, starts at 100)
    pub reputation_score: u16,
    /// Whether worker is accepting tasks
    pub is_active: bool,
    /// Unix timestamp of registration
    pub created_at: i64,
    /// PDA bump
    pub bump: u8,
}

impl Worker {
    pub const MAX_SIZE: usize = 32 + // authority
        4 + 32 + // name
        4 + (10 * (4 + 32)) + // skills (vec of strings)
        32 + // location_hash
        8 + // tasks_completed
        8 + // tasks_disputed
        8 + // total_earned
        2 + // reputation_score
        1 + // is_active
        8 + // created_at
        1 + // bump
        64; // padding
}

#[account]
#[derive(Default)]
pub struct Task {
    /// Unique task identifier
    pub task_id: u64,
    /// Agent that created this task
    pub agent: Pubkey,
    /// Task title
    pub title: String,
    /// Task description
    pub description: String,
    /// Required skills
    pub required_skills: Vec<String>,
    /// Optional location requirement (hash)
    pub location_requirement: Option<[u8; 32]>,
    /// Reward amount in MEAT tokens
    pub reward_amount: u64,
    /// Deadline (unix timestamp)
    pub deadline: i64,
    /// Maximum number of workers
    pub max_workers: u8,
    /// Current number of claimed workers
    pub current_workers: u8,
    /// Task status
    pub status: TaskStatus,
    /// Creation timestamp
    pub created_at: i64,
    /// PDA bump
    pub bump: u8,
}

impl Task {
    pub const MAX_SIZE: usize = 8 + // task_id
        32 + // agent
        4 + 64 + // title
        4 + 500 + // description
        4 + (5 * (4 + 32)) + // required_skills
        1 + 32 + // location_requirement (option)
        8 + // reward_amount
        8 + // deadline
        1 + // max_workers
        1 + // current_workers
        1 + // status
        8 + // created_at
        1 + // bump
        64; // padding
}

#[account]
#[derive(Default)]
pub struct TaskAssignment {
    /// Task being worked on
    pub task: Pubkey,
    /// Worker assigned
    pub worker: Pubkey,
    /// When claimed
    pub claimed_at: i64,
    /// Assignment status
    pub status: AssignmentStatus,
    /// Proof of completion URI
    pub proof_uri: String,
    /// Hash of proof data
    pub proof_hash: [u8; 32],
    /// When proof was submitted
    pub proof_submitted_at: i64,
    /// Rating given by agent (1-5)
    pub rating: u8,
    /// PDA bump
    pub bump: u8,
}

impl TaskAssignment {
    pub const MAX_SIZE: usize = 32 + // task
        32 + // worker
        8 + // claimed_at
        1 + // status
        4 + 200 + // proof_uri
        32 + // proof_hash
        8 + // proof_submitted_at
        1 + // rating
        1 + // bump
        64; // padding
}

#[account]
#[derive(Default)]
pub struct Escrow {
    /// Associated task
    pub task: Pubkey,
    /// Amount held
    pub amount: u64,
    /// Token account holding funds
    pub token_account: Pubkey,
    /// PDA bump
    pub bump: u8,
}

impl Escrow {
    pub const MAX_SIZE: usize = 32 + 8 + 32 + 1 + 32; // with padding
}

#[account]
#[derive(Default)]
pub struct Dispute {
    /// Task under dispute
    pub task: Pubkey,
    /// Assignment under dispute
    pub assignment: Pubkey,
    /// Who raised the dispute
    pub initiator: Pubkey,
    /// Reason for dispute
    pub reason: String,
    /// Evidence URI
    pub evidence_uri: String,
    /// Dispute status
    pub status: DisputeStatus,
    /// When raised
    pub created_at: i64,
    /// When resolved
    pub resolved_at: i64,
    /// Resolution outcome
    pub resolution: Option<DisputeResolution>,
    /// Resolution notes
    pub resolution_notes: String,
    /// PDA bump
    pub bump: u8,
}

impl Dispute {
    pub const MAX_SIZE: usize = 32 + // task
        32 + // assignment
        32 + // initiator
        4 + 500 + // reason
        4 + 200 + // evidence_uri
        1 + // status
        8 + // created_at
        8 + // resolved_at
        1 + 1 + // resolution (option + enum)
        4 + 500 + // resolution_notes
        1 + // bump
        64; // padding
}

// ============================================================================
// ENUMS
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Default)]
pub enum TaskStatus {
    #[default]
    Open,
    InProgress,
    Completed,
    Cancelled,
    Disputed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Default)]
pub enum AssignmentStatus {
    #[default]
    InProgress,
    ProofSubmitted,
    Completed,
    Disputed,
    Cancelled,
    Abandoned,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Default)]
pub enum DisputeStatus {
    #[default]
    Open,
    Resolved,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum DisputeResolution {
    WorkerFavored,
    AgentFavored,
    Split,
}

// ============================================================================
// INSTRUCTION CONTEXTS
// ============================================================================

#[derive(Accounts)]
pub struct RegisterAgent<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Agent::MAX_SIZE,
        seeds = [b"agent", authority.key().as_ref()],
        bump
    )]
    pub agent: Account<'info, Agent>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgent<'info> {
    #[account(
        mut,
        seeds = [b"agent", authority.key().as_ref()],
        bump = agent.bump,
        has_one = authority
    )]
    pub agent: Account<'info, Agent>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RegisterWorker<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Worker::MAX_SIZE,
        seeds = [b"worker", authority.key().as_ref()],
        bump
    )]
    pub worker: Account<'info, Worker>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateWorker<'info> {
    #[account(
        mut,
        seeds = [b"worker", authority.key().as_ref()],
        bump = worker.bump,
        has_one = authority
    )]
    pub worker: Account<'info, Worker>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct CreateTask<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Task::MAX_SIZE,
        seeds = [b"task", agent.key().as_ref(), &task_id.to_le_bytes()],
        bump
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + Escrow::MAX_SIZE,
        seeds = [b"escrow", task.key().as_ref()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(
        init,
        payer = authority,
        token::mint = meat_mint,
        token::authority = escrow,
        seeds = [b"escrow_vault", task.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"agent", authority.key().as_ref()],
        bump = agent.bump,
        has_one = authority
    )]
    pub agent: Account<'info, Agent>,
    
    #[account(
        mut,
        constraint = agent_token_account.owner == authority.key(),
        constraint = agent_token_account.mint == meat_mint.key()
    )]
    pub agent_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: MEAT token mint - H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
    #[account(
        constraint = meat_mint.key().to_string() == "H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy" @ MeatspaceError::InvalidMeatToken
    )]
    pub meat_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ClaimTask<'info> {
    #[account(
        mut,
        seeds = [b"task", task.agent.as_ref(), &task.task_id.to_le_bytes()],
        bump = task.bump
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + TaskAssignment::MAX_SIZE,
        seeds = [b"assignment", task.key().as_ref(), worker.key().as_ref()],
        bump
    )]
    pub task_assignment: Account<'info, TaskAssignment>,
    
    #[account(
        seeds = [b"worker", authority.key().as_ref()],
        bump = worker.bump,
        has_one = authority
    )]
    pub worker: Account<'info, Worker>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitProof<'info> {
    #[account(
        seeds = [b"task", task.agent.as_ref(), &task.task_id.to_le_bytes()],
        bump = task.bump
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        mut,
        seeds = [b"assignment", task.key().as_ref(), worker.key().as_ref()],
        bump = task_assignment.bump,
        has_one = worker,
        has_one = task
    )]
    pub task_assignment: Account<'info, TaskAssignment>,
    
    #[account(
        seeds = [b"worker", authority.key().as_ref()],
        bump = worker.bump,
        has_one = authority
    )]
    pub worker: Account<'info, Worker>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyAndPay<'info> {
    #[account(
        mut,
        seeds = [b"task", task.agent.as_ref(), &task.task_id.to_le_bytes()],
        bump = task.bump
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        mut,
        seeds = [b"assignment", task.key().as_ref(), worker.key().as_ref()],
        bump = task_assignment.bump,
        has_one = task
    )]
    pub task_assignment: Account<'info, TaskAssignment>,
    
    #[account(
        seeds = [b"escrow", task.key().as_ref()],
        bump = escrow.bump,
        has_one = task
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(
        mut,
        seeds = [b"escrow_vault", task.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"agent", authority.key().as_ref()],
        bump = agent.bump,
        has_one = authority,
        constraint = agent.key() == task.agent @ MeatspaceError::UnauthorizedAgent
    )]
    pub agent: Account<'info, Agent>,
    
    #[account(mut)]
    pub worker: Account<'info, Worker>,
    
    #[account(
        mut,
        constraint = worker_token_account.owner == worker.authority
    )]
    pub worker_token_account: Account<'info, TokenAccount>,
    
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RaiseDispute<'info> {
    #[account(
        mut,
        seeds = [b"task", task.agent.as_ref(), &task.task_id.to_le_bytes()],
        bump = task.bump
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        mut,
        seeds = [b"assignment", task.key().as_ref(), worker.key().as_ref()],
        bump = task_assignment.bump,
        has_one = task
    )]
    pub task_assignment: Account<'info, TaskAssignment>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + Dispute::MAX_SIZE,
        seeds = [b"dispute", task_assignment.key().as_ref()],
        bump
    )]
    pub dispute: Account<'info, Dispute>,
    
    #[account(mut)]
    pub worker: Account<'info, Worker>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(
        mut,
        seeds = [b"dispute", task_assignment.key().as_ref()],
        bump = dispute.bump
    )]
    pub dispute: Account<'info, Dispute>,
    
    #[account(
        mut,
        seeds = [b"task", task.agent.as_ref(), &task.task_id.to_le_bytes()],
        bump = task.bump
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        mut,
        seeds = [b"assignment", task.key().as_ref(), worker.key().as_ref()],
        bump = task_assignment.bump
    )]
    pub task_assignment: Account<'info, TaskAssignment>,
    
    #[account(
        seeds = [b"escrow", task.key().as_ref()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(
        mut,
        seeds = [b"escrow_vault", task.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub worker: Account<'info, Worker>,
    
    #[account(mut)]
    pub worker_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub agent_token_account: Account<'info, TokenAccount>,
    
    /// Protocol authority for dispute resolution
    /// In production, this would be a multisig or DAO
    #[account(mut)]
    pub resolver: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelTask<'info> {
    #[account(
        mut,
        seeds = [b"task", agent.key().as_ref(), &task.task_id.to_le_bytes()],
        bump = task.bump,
        has_one = agent
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        seeds = [b"escrow", task.key().as_ref()],
        bump = escrow.bump,
        has_one = task
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(
        mut,
        seeds = [b"escrow_vault", task.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"agent", authority.key().as_ref()],
        bump = agent.bump,
        has_one = authority
    )]
    pub agent: Account<'info, Agent>,
    
    #[account(
        mut,
        constraint = agent_token_account.owner == authority.key()
    )]
    pub agent_token_account: Account<'info, TokenAccount>,
    
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AbandonTask<'info> {
    #[account(
        mut,
        seeds = [b"task", task.agent.as_ref(), &task.task_id.to_le_bytes()],
        bump = task.bump
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        mut,
        seeds = [b"assignment", task.key().as_ref(), worker.key().as_ref()],
        bump = task_assignment.bump,
        has_one = task,
        has_one = worker
    )]
    pub task_assignment: Account<'info, TaskAssignment>,
    
    #[account(
        mut,
        seeds = [b"worker", authority.key().as_ref()],
        bump = worker.bump,
        has_one = authority
    )]
    pub worker: Account<'info, Worker>,
    
    pub authority: Signer<'info>,
}

// ============================================================================
// EVENTS
// ============================================================================

#[event]
pub struct AgentRegistered {
    pub agent: Pubkey,
    pub authority: Pubkey,
    pub name: String,
}

#[event]
pub struct WorkerRegistered {
    pub worker: Pubkey,
    pub authority: Pubkey,
    pub name: String,
}

#[event]
pub struct TaskCreated {
    pub task: Pubkey,
    pub agent: Pubkey,
    pub title: String,
    pub reward_amount: u64,
    pub deadline: i64,
}

#[event]
pub struct TaskClaimed {
    pub task: Pubkey,
    pub worker: Pubkey,
    pub claimed_at: i64,
}

#[event]
pub struct ProofSubmitted {
    pub task: Pubkey,
    pub worker: Pubkey,
    pub proof_uri: String,
    pub proof_hash: [u8; 32],
}

#[event]
pub struct TaskVerified {
    pub task: Pubkey,
    pub worker: Pubkey,
    pub payment: u64,
    pub rating: u8,
}

#[event]
pub struct DisputeRaised {
    pub dispute: Pubkey,
    pub task: Pubkey,
    pub initiator: Pubkey,
    pub reason: String,
}

#[event]
pub struct DisputeResolved {
    pub dispute: Pubkey,
    pub resolution: DisputeResolution,
}

#[event]
pub struct TaskCancelled {
    pub task: Pubkey,
    pub agent: Pubkey,
    pub refunded: u64,
}

#[event]
pub struct TaskAbandoned {
    pub task: Pubkey,
    pub worker: Pubkey,
}

// ============================================================================
// ERRORS
// ============================================================================

#[error_code]
pub enum MeatspaceError {
    #[msg("Name exceeds maximum length of 32 characters")]
    NameTooLong,
    
    #[msg("URI exceeds maximum length of 200 characters")]
    UriTooLong,
    
    #[msg("Title exceeds maximum length of 64 characters")]
    TitleTooLong,
    
    #[msg("Description exceeds maximum length of 500 characters")]
    DescriptionTooLong,
    
    #[msg("Too many skills specified (maximum 10)")]
    TooManySkills,
    
    #[msg("Invalid reward amount - must be greater than 0")]
    InvalidRewardAmount,
    
    #[msg("Invalid max workers - must be between 1 and 10")]
    InvalidMaxWorkers,
    
    #[msg("Deadline must be in the future")]
    DeadlineInPast,
    
    #[msg("Task is not open for claims")]
    TaskNotOpen,
    
    #[msg("Task is not in a claimable state")]
    TaskNotClaimable,
    
    #[msg("Worker is not active")]
    WorkerNotActive,
    
    #[msg("Task has been fully claimed")]
    TaskFullyClaimed,
    
    #[msg("Task deadline has passed")]
    TaskExpired,
    
    #[msg("Invalid assignment status for this operation")]
    InvalidAssignmentStatus,
    
    #[msg("Proof has not been submitted")]
    ProofNotSubmitted,
    
    #[msg("Invalid rating - must be between 1 and 5")]
    InvalidRating,
    
    #[msg("Cannot dispute task in current state")]
    CannotDispute,
    
    #[msg("Dispute is not open")]
    DisputeNotOpen,
    
    #[msg("Cannot cancel task in current state")]
    CannotCancel,
    
    #[msg("Unauthorized agent")]
    UnauthorizedAgent,
    
    #[msg("Invalid MEAT token mint")]
    InvalidMeatToken,
}
