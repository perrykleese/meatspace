/**
 * MEATSPACE SDK
 * 
 * A TypeScript SDK for AI agents to post real-world tasks to human workers.
 * 
 * @example
 * ```typescript
 * const client = new MeatspaceClient(wallet);
 * const task = await client.postTask({
 *   description: "Photo of menu at Joe's Pizza",
 *   bounty: 5.0,
 *   expiresIn: 3600
 * });
 * ```
 */

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/** Wallet interface for signing transactions */
export interface Wallet {
  address: string;
  sign(message: string): Promise<string>;
  getBalance?(): Promise<number>;
}

/** Simple wallet implementation using a private key */
export interface SimpleWalletConfig {
  privateKey: string;
  rpcUrl?: string;
}

/** Task status enum */
export enum TaskStatus {
  PENDING = 'pending',
  CLAIMED = 'claimed',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

/** Task priority levels */
export enum TaskPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

/** Location constraint for tasks */
export interface LocationConstraint {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  name?: string;
}

/** Time window for task completion */
export interface TimeWindow {
  start?: Date;
  end?: Date;
}

/** Evidence/proof attached to task submission */
export interface TaskEvidence {
  type: 'image' | 'video' | 'audio' | 'document' | 'text' | 'location';
  url?: string;
  data?: string;
  mimeType?: string;
  hash?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/** Worker profile info */
export interface Worker {
  id: string;
  address: string;
  reputation: number;
  completedTasks: number;
  activeTaskCount: number;
  joinedAt: Date;
  skills?: string[];
}

/** Task submission from a worker */
export interface TaskSubmission {
  id: string;
  taskId: string;
  workerId: string;
  worker: Worker;
  evidence: TaskEvidence[];
  submittedAt: Date;
  notes?: string;
}

/** Full task object */
export interface Task {
  id: string;
  description: string;
  bounty: number;
  currency: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  expiresAt: Date;
  claimedAt?: Date;
  completedAt?: Date;
  creatorAddress: string;
  workerAddress?: string;
  worker?: Worker;
  location?: LocationConstraint;
  timeWindow?: TimeWindow;
  tags?: string[];
  requiredEvidence?: string[];
  submission?: TaskSubmission;
  metadata?: Record<string, unknown>;
  transactionHash?: string;
}

/** Options for creating a new task */
export interface PostTaskOptions {
  /** Human-readable description of what needs to be done */
  description: string;
  
  /** Bounty amount in USD (or configured currency) */
  bounty: number;
  
  /** Time until expiration in seconds */
  expiresIn: number;
  
  /** Optional priority level (default: NORMAL) */
  priority?: TaskPriority;
  
  /** Optional location constraint */
  location?: LocationConstraint;
  
  /** Optional time window for completion */
  timeWindow?: TimeWindow;
  
  /** Optional tags for categorization */
  tags?: string[];
  
  /** Optional list of required evidence types */
  requiredEvidence?: ('image' | 'video' | 'location' | 'text')[];
  
  /** Optional arbitrary metadata */
  metadata?: Record<string, unknown>;
}

/** Options for querying tasks */
export interface QueryTasksOptions {
  status?: TaskStatus | TaskStatus[];
  creatorAddress?: string;
  workerAddress?: string;
  minBounty?: number;
  maxBounty?: number;
  tags?: string[];
  nearLocation?: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
  };
  limit?: number;
  offset?: number;
  sortBy?: 'bounty' | 'createdAt' | 'expiresAt';
  sortOrder?: 'asc' | 'desc';
}

/** Client configuration options */
export interface MeatspaceClientConfig {
  /** API base URL (default: https://api.meatspace.network) */
  apiUrl?: string;
  
  /** Network to use (default: mainnet) */
  network?: 'mainnet' | 'testnet' | 'devnet';
  
  /** Default currency for bounties (default: USD) */
  currency?: string;
  
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  
  /** Enable debug logging */
  debug?: boolean;
  
  /** Custom headers for API requests */
  headers?: Record<string, string>;
  
  /** Retry configuration */
  retry?: {
    maxAttempts: number;
    delayMs: number;
    backoffMultiplier: number;
  };
}

/** Event types for task updates */
export type TaskEventType = 
  | 'task.created'
  | 'task.claimed'
  | 'task.submitted'
  | 'task.completed'
  | 'task.disputed'
  | 'task.expired'
  | 'task.cancelled';

/** Task event payload */
export interface TaskEvent {
  type: TaskEventType;
  task: Task;
  timestamp: Date;
  data?: Record<string, unknown>;
}

/** Event handler function */
export type TaskEventHandler = (event: TaskEvent) => void | Promise<void>;

// =============================================================================
// ERRORS
// =============================================================================

/** Base error class for MEATSPACE SDK */
export class MeatspaceError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MeatspaceError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, MeatspaceError.prototype);
  }
}

/** Error thrown when wallet operations fail */
export class WalletError extends MeatspaceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'WALLET_ERROR', undefined, details);
    this.name = 'WalletError';
    Object.setPrototypeOf(this, WalletError.prototype);
  }
}

/** Error thrown when API requests fail */
export class ApiError extends MeatspaceError {
  constructor(message: string, statusCode: number, details?: Record<string, unknown>) {
    super(message, 'API_ERROR', statusCode, details);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** Error thrown when task operations fail */
export class TaskError extends MeatspaceError {
  public readonly taskId?: string;

  constructor(message: string, code: string, taskId?: string, details?: Record<string, unknown>) {
    super(message, code, undefined, details);
    this.name = 'TaskError';
    this.taskId = taskId;
    Object.setPrototypeOf(this, TaskError.prototype);
  }
}

/** Error thrown when validation fails */
export class ValidationError extends MeatspaceError {
  public readonly field?: string;

  constructor(message: string, field?: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, { ...details, field });
    this.name = 'ValidationError';
    this.field = field;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/** Error thrown on insufficient funds */
export class InsufficientFundsError extends MeatspaceError {
  public readonly required: number;
  public readonly available: number;

  constructor(required: number, available: number) {
    super(
      `Insufficient funds: required ${required}, available ${available}`,
      'INSUFFICIENT_FUNDS',
      402,
      { required, available }
    );
    this.name = 'InsufficientFundsError';
    this.required = required;
    this.available = available;
    Object.setPrototypeOf(this, InsufficientFundsError.prototype);
  }
}

// =============================================================================
// SIMPLE WALLET IMPLEMENTATION
// =============================================================================

/** 
 * Simple wallet implementation for basic use cases.
 * For production, use a proper wallet library (ethers, viem, etc.)
 */
export class SimpleWallet implements Wallet {
  public readonly address: string;
  private readonly privateKey: string;
  private readonly rpcUrl: string;

  constructor(config: SimpleWalletConfig) {
    this.privateKey = config.privateKey;
    this.rpcUrl = config.rpcUrl || 'https://rpc.meatspace.network';
    // In a real implementation, derive address from private key
    this.address = this.deriveAddress(config.privateKey);
  }

  private deriveAddress(privateKey: string): string {
    // Simplified - in production use proper crypto library
    // This creates a deterministic address from the key for demo purposes
    const hash = this.simpleHash(privateKey);
    return `0x${hash.slice(0, 40)}`;
  }

  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(40, '0');
  }

  async sign(message: string): Promise<string> {
    // Simplified signing - in production use proper crypto
    const combined = `${this.privateKey}:${message}`;
    const signature = this.simpleHash(combined);
    return `0x${signature}`;
  }

  async getBalance(): Promise<number> {
    // In production, query the RPC endpoint
    // For now, return a mock balance
    return 100.0;
  }

  /** Create a wallet from a private key string */
  static fromPrivateKey(privateKey: string, rpcUrl?: string): SimpleWallet {
    return new SimpleWallet({ privateKey, rpcUrl });
  }

  /** Generate a new random wallet (for testing) */
  static generate(): SimpleWallet {
    const randomKey = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return new SimpleWallet({ privateKey: randomKey });
  }
}

// =============================================================================
// MEATSPACE CLIENT
// =============================================================================

/**
 * Main MEATSPACE client for posting and managing tasks.
 * 
 * @example
 * ```typescript
 * // Initialize with a wallet
 * const wallet = SimpleWallet.fromPrivateKey(process.env.PRIVATE_KEY!);
 * const client = new MeatspaceClient(wallet);
 * 
 * // Post a task in 3 lines
 * const task = await client.postTask({
 *   description: "Photo of menu at Joe's Pizza",
 *   bounty: 5.0,
 *   expiresIn: 3600
 * });
 * 
 * // Wait for completion
 * const result = await client.waitForCompletion(task.id);
 * console.log('Task completed!', result.submission?.evidence);
 * ```
 */
export class MeatspaceClient {
  private readonly wallet: Wallet;
  private readonly config: Required<MeatspaceClientConfig>;
  private readonly eventHandlers: Map<TaskEventType | '*', Set<TaskEventHandler>>;
  private pollingIntervals: Map<string, NodeJS.Timeout>;

  constructor(wallet: Wallet, config: MeatspaceClientConfig = {}) {
    this.wallet = wallet;
    this.config = {
      apiUrl: config.apiUrl || 'https://api.meatspace.network',
      network: config.network || 'mainnet',
      currency: config.currency || 'USD',
      timeout: config.timeout || 30000,
      debug: config.debug || false,
      headers: config.headers || {},
      retry: config.retry || {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2
      }
    };
    this.eventHandlers = new Map();
    this.pollingIntervals = new Map();
  }

  // ---------------------------------------------------------------------------
  // CORE TASK OPERATIONS
  // ---------------------------------------------------------------------------

  /**
   * Post a new task to the MEATSPACE network.
   * 
   * @param options - Task configuration
   * @returns The created task
   * @throws {ValidationError} If options are invalid
   * @throws {InsufficientFundsError} If wallet balance is too low
   * @throws {ApiError} If the API request fails
   */
  async postTask(options: PostTaskOptions): Promise<Task> {
    // Validate inputs
    this.validatePostTaskOptions(options);

    // Check balance if wallet supports it
    if (this.wallet.getBalance) {
      const balance = await this.wallet.getBalance();
      if (balance < options.bounty) {
        throw new InsufficientFundsError(options.bounty, balance);
      }
    }

    // Build task payload
    const expiresAt = new Date(Date.now() + options.expiresIn * 1000);
    const payload = {
      description: options.description,
      bounty: options.bounty,
      currency: this.config.currency,
      expiresAt: expiresAt.toISOString(),
      priority: options.priority || TaskPriority.NORMAL,
      location: options.location,
      timeWindow: options.timeWindow ? {
        start: options.timeWindow.start?.toISOString(),
        end: options.timeWindow.end?.toISOString()
      } : undefined,
      tags: options.tags,
      requiredEvidence: options.requiredEvidence,
      metadata: options.metadata
    };

    // Sign the payload
    const message = JSON.stringify(payload);
    const signature = await this.wallet.sign(message);

    // Make API request
    const response = await this.request<Task>('POST', '/tasks', {
      ...payload,
      creatorAddress: this.wallet.address,
      signature
    });

    this.log('Task created:', response.id);
    return this.parseTask(response);
  }

  /**
   * Get a task by ID.
   * 
   * @param taskId - The task ID
   * @returns The task
   * @throws {TaskError} If task not found
   */
  async getTask(taskId: string): Promise<Task> {
    const response = await this.request<Task>('GET', `/tasks/${taskId}`);
    return this.parseTask(response);
  }

  /**
   * Query tasks with filters.
   * 
   * @param options - Query options
   * @returns Array of matching tasks
   */
  async queryTasks(options: QueryTasksOptions = {}): Promise<Task[]> {
    const params = new URLSearchParams();
    
    if (options.status) {
      const statuses = Array.isArray(options.status) ? options.status : [options.status];
      statuses.forEach(s => params.append('status', s));
    }
    if (options.creatorAddress) params.set('creatorAddress', options.creatorAddress);
    if (options.workerAddress) params.set('workerAddress', options.workerAddress);
    if (options.minBounty !== undefined) params.set('minBounty', options.minBounty.toString());
    if (options.maxBounty !== undefined) params.set('maxBounty', options.maxBounty.toString());
    if (options.tags) options.tags.forEach(t => params.append('tags', t));
    if (options.nearLocation) {
      params.set('lat', options.nearLocation.latitude.toString());
      params.set('lng', options.nearLocation.longitude.toString());
      params.set('radius', options.nearLocation.radiusMeters.toString());
    }
    if (options.limit) params.set('limit', options.limit.toString());
    if (options.offset) params.set('offset', options.offset.toString());
    if (options.sortBy) params.set('sortBy', options.sortBy);
    if (options.sortOrder) params.set('sortOrder', options.sortOrder);

    const queryString = params.toString();
    const path = queryString ? `/tasks?${queryString}` : '/tasks';
    const response = await this.request<Task[]>('GET', path);
    return response.map(t => this.parseTask(t));
  }

  /**
   * Get all tasks created by this wallet.
   */
  async getMyTasks(status?: TaskStatus | TaskStatus[]): Promise<Task[]> {
    return this.queryTasks({
      creatorAddress: this.wallet.address,
      status
    });
  }

  /**
   * Cancel a pending task and reclaim the bounty.
   * 
   * @param taskId - The task ID to cancel
   * @throws {TaskError} If task cannot be cancelled
   */
  async cancelTask(taskId: string): Promise<Task> {
    const signature = await this.wallet.sign(`cancel:${taskId}`);
    const response = await this.request<Task>('POST', `/tasks/${taskId}/cancel`, {
      signature,
      address: this.wallet.address
    });
    this.log('Task cancelled:', taskId);
    return this.parseTask(response);
  }

  /**
   * Approve a task submission and release the bounty.
   * 
   * @param taskId - The task ID
   * @param rating - Optional rating for the worker (1-5)
   * @param feedback - Optional feedback text
   */
  async approveTask(taskId: string, rating?: number, feedback?: string): Promise<Task> {
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new ValidationError('Rating must be between 1 and 5', 'rating');
    }

    const signature = await this.wallet.sign(`approve:${taskId}`);
    const response = await this.request<Task>('POST', `/tasks/${taskId}/approve`, {
      signature,
      address: this.wallet.address,
      rating,
      feedback
    });
    this.log('Task approved:', taskId);
    return this.parseTask(response);
  }

  /**
   * Dispute a task submission.
   * 
   * @param taskId - The task ID
   * @param reason - Reason for the dispute
   */
  async disputeTask(taskId: string, reason: string): Promise<Task> {
    if (!reason || reason.trim().length < 10) {
      throw new ValidationError('Dispute reason must be at least 10 characters', 'reason');
    }

    const signature = await this.wallet.sign(`dispute:${taskId}`);
    const response = await this.request<Task>('POST', `/tasks/${taskId}/dispute`, {
      signature,
      address: this.wallet.address,
      reason
    });
    this.log('Task disputed:', taskId);
    return this.parseTask(response);
  }

  // ---------------------------------------------------------------------------
  // WAITING & POLLING
  // ---------------------------------------------------------------------------

  /**
   * Wait for a task to reach a specific status.
   * 
   * @param taskId - The task ID
   * @param targetStatus - Status to wait for (default: COMPLETED)
   * @param options - Polling options
   * @returns The task when it reaches the target status
   */
  async waitForStatus(
    taskId: string,
    targetStatus: TaskStatus | TaskStatus[] = TaskStatus.COMPLETED,
    options: { pollInterval?: number; timeout?: number } = {}
  ): Promise<Task> {
    const { pollInterval = 5000, timeout = 3600000 } = options;
    const targetStatuses = Array.isArray(targetStatus) ? targetStatus : [targetStatus];
    const terminalStatuses = [
      TaskStatus.COMPLETED,
      TaskStatus.EXPIRED,
      TaskStatus.CANCELLED,
      TaskStatus.DISPUTED
    ];

    const startTime = Date.now();

    while (true) {
      const task = await this.getTask(taskId);

      if (targetStatuses.includes(task.status)) {
        return task;
      }

      // Check for terminal status that's not our target
      if (terminalStatuses.includes(task.status) && !targetStatuses.includes(task.status)) {
        throw new TaskError(
          `Task reached terminal status: ${task.status}`,
          'UNEXPECTED_STATUS',
          taskId,
          { expected: targetStatuses, actual: task.status }
        );
      }

      // Check timeout
      if (Date.now() - startTime > timeout) {
        throw new TaskError(
          `Timeout waiting for task status: ${targetStatuses.join(', ')}`,
          'TIMEOUT',
          taskId
        );
      }

      await this.sleep(pollInterval);
    }
  }

  /**
   * Wait for task completion (convenience method).
   */
  async waitForCompletion(
    taskId: string,
    options?: { pollInterval?: number; timeout?: number }
  ): Promise<Task> {
    return this.waitForStatus(taskId, TaskStatus.SUBMITTED, options);
  }

  /**
   * Wait for task to be claimed by a worker.
   */
  async waitForClaim(
    taskId: string,
    options?: { pollInterval?: number; timeout?: number }
  ): Promise<Task> {
    return this.waitForStatus(
      taskId,
      [TaskStatus.CLAIMED, TaskStatus.IN_PROGRESS, TaskStatus.SUBMITTED, TaskStatus.COMPLETED],
      options
    );
  }

  // ---------------------------------------------------------------------------
  // EVENT HANDLING
  // ---------------------------------------------------------------------------

  /**
   * Subscribe to task events.
   * 
   * @param event - Event type or '*' for all events
   * @param handler - Event handler function
   * @returns Unsubscribe function
   */
  on(event: TaskEventType | '*', handler: TaskEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  /**
   * Start polling for task updates (enables event handlers).
   * 
   * @param taskIds - Task IDs to watch
   * @param pollInterval - Polling interval in ms (default: 5000)
   */
  watch(taskIds: string | string[], pollInterval = 5000): void {
    const ids = Array.isArray(taskIds) ? taskIds : [taskIds];
    
    for (const taskId of ids) {
      if (this.pollingIntervals.has(taskId)) continue;

      let lastStatus: TaskStatus | null = null;

      const interval = setInterval(async () => {
        try {
          const task = await this.getTask(taskId);
          
          if (lastStatus && task.status !== lastStatus) {
            const eventType = `task.${task.status}` as TaskEventType;
            await this.emitEvent({ type: eventType, task, timestamp: new Date() });
          }
          
          lastStatus = task.status;
        } catch (error) {
          this.log('Polling error:', error);
        }
      }, pollInterval);

      this.pollingIntervals.set(taskId, interval);
    }
  }

  /**
   * Stop watching a task.
   */
  unwatch(taskId: string): void {
    const interval = this.pollingIntervals.get(taskId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(taskId);
    }
  }

  /**
   * Stop all watchers.
   */
  unwatchAll(): void {
    for (const interval of this.pollingIntervals.values()) {
      clearInterval(interval);
    }
    this.pollingIntervals.clear();
  }

  private async emitEvent(event: TaskEvent): Promise<void> {
    const handlers = [
      ...(this.eventHandlers.get(event.type) || []),
      ...(this.eventHandlers.get('*') || [])
    ];

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        this.log('Event handler error:', error);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // WALLET INFO
  // ---------------------------------------------------------------------------

  /**
   * Get the wallet address.
   */
  get address(): string {
    return this.wallet.address;
  }

  /**
   * Get the wallet balance (if supported).
   */
  async getBalance(): Promise<number | null> {
    if (this.wallet.getBalance) {
      return this.wallet.getBalance();
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // INTERNAL HELPERS
  // ---------------------------------------------------------------------------

  private validatePostTaskOptions(options: PostTaskOptions): void {
    if (!options.description || options.description.trim().length < 10) {
      throw new ValidationError(
        'Description must be at least 10 characters',
        'description'
      );
    }

    if (options.description.length > 5000) {
      throw new ValidationError(
        'Description must be less than 5000 characters',
        'description'
      );
    }

    if (typeof options.bounty !== 'number' || options.bounty <= 0) {
      throw new ValidationError('Bounty must be a positive number', 'bounty');
    }

    if (options.bounty < 0.01) {
      throw new ValidationError('Minimum bounty is $0.01', 'bounty');
    }

    if (options.bounty > 10000) {
      throw new ValidationError('Maximum bounty is $10,000', 'bounty');
    }

    if (typeof options.expiresIn !== 'number' || options.expiresIn <= 0) {
      throw new ValidationError('expiresIn must be a positive number (seconds)', 'expiresIn');
    }

    if (options.expiresIn < 300) {
      throw new ValidationError('Minimum expiration is 5 minutes (300 seconds)', 'expiresIn');
    }

    if (options.expiresIn > 604800) {
      throw new ValidationError('Maximum expiration is 7 days (604800 seconds)', 'expiresIn');
    }

    if (options.location) {
      const { latitude, longitude, radiusMeters } = options.location;
      if (latitude < -90 || latitude > 90) {
        throw new ValidationError('Invalid latitude', 'location.latitude');
      }
      if (longitude < -180 || longitude > 180) {
        throw new ValidationError('Invalid longitude', 'location.longitude');
      }
      if (radiusMeters <= 0 || radiusMeters > 100000) {
        throw new ValidationError('Radius must be between 1 and 100000 meters', 'location.radiusMeters');
      }
    }
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.config.apiUrl}${path}`;
    const { maxAttempts, delayMs, backoffMultiplier } = this.config.retry;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-Network': this.config.network,
            ...this.config.headers
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: AbortSignal.timeout(this.config.timeout)
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new ApiError(
            errorBody.message || `HTTP ${response.status}`,
            response.status,
            errorBody
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.statusCode && error.statusCode < 500) {
          throw error;
        }

        if (attempt < maxAttempts) {
          const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
          this.log(`Request failed, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`);
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new ApiError('Request failed', 500);
  }

  private parseTask(data: Record<string, unknown>): Task {
    return {
      ...data,
      createdAt: new Date(data.createdAt as string),
      expiresAt: new Date(data.expiresAt as string),
      claimedAt: data.claimedAt ? new Date(data.claimedAt as string) : undefined,
      completedAt: data.completedAt ? new Date(data.completedAt as string) : undefined,
      status: data.status as TaskStatus,
      priority: data.priority as TaskPriority
    } as Task;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[MEATSPACE]', ...args);
    }
  }
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

/** Create a client with a private key (convenience function) */
export function createClient(
  privateKey: string,
  config?: MeatspaceClientConfig
): MeatspaceClient {
  const wallet = SimpleWallet.fromPrivateKey(privateKey);
  return new MeatspaceClient(wallet, config);
}

/** Create a client for testnet (convenience function) */
export function createTestnetClient(
  privateKey: string,
  config?: Omit<MeatspaceClientConfig, 'network'>
): MeatspaceClient {
  return createClient(privateKey, {
    ...config,
    network: 'testnet',
    apiUrl: config?.apiUrl || 'https://testnet-api.meatspace.network'
  });
}

// Default export
export default MeatspaceClient;
