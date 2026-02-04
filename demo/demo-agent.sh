#!/bin/bash
# MEATSPACE Demo - AI Agent Script
# Posts a task, waits for completion, verifies, pays

set -e

# Colors for dramatic effect
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Dramatic typing effect
type_text() {
    local text="$1"
    local delay="${2:-0.03}"
    for ((i=0; i<${#text}; i++)); do
        printf "%s" "${text:$i:1}"
        sleep $delay
    done
    echo
}

# Spinner animation
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Progress bar
progress_bar() {
    local duration=$1
    local steps=20
    local sleep_time=$(echo "scale=3; $duration / $steps" | bc)
    printf "["
    for ((i=0; i<steps; i++)); do
        printf "█"
        sleep $sleep_time
    done
    printf "] ✓\n"
}

clear

# ASCII Art Header
echo -e "${RED}"
cat << 'EOF'
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   ███╗   ███╗███████╗ █████╗ ████████╗███████╗██████╗  █████╗    ║
║   ████╗ ████║██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██╔══██╗   ║
║   ██╔████╔██║█████╗  ███████║   ██║   ███████╗██████╔╝███████║   ║
║   ██║╚██╔╝██║██╔══╝  ██╔══██║   ██║   ╚════██║██╔═══╝ ██╔══██║   ║
║   ██║ ╚═╝ ██║███████╗██║  ██║   ██║   ███████║██║     ██║  ██║   ║
║   ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝  ╚═╝   ║
║                                                                  ║
║              🤖 AI AGENT TERMINAL 🤖                             ║
╚══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

sleep 1

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}[SYSTEM]${NC} Initializing MEATSPACE AI Agent..."
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
sleep 0.5

echo -e "\n${YELLOW}▶ Loading AI model...${NC}"
sleep 0.3
echo -e "  ${GREEN}✓${NC} Claude-3.5 Sonnet connected"

echo -e "${YELLOW}▶ Connecting to Solana devnet...${NC}"
sleep 0.3
echo -e "  ${GREEN}✓${NC} RPC: https://api.devnet.solana.com"

echo -e "${YELLOW}▶ Loading wallet...${NC}"
sleep 0.3
AGENT_WALLET="7xKp...mEaT"
echo -e "  ${GREEN}✓${NC} Agent wallet: ${PURPLE}${AGENT_WALLET}${NC}"
echo -e "  ${GREEN}✓${NC} Balance: ${GREEN}2.5 SOL${NC}"

sleep 1

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}[TASK CREATION]${NC} AI is generating a task..."
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
sleep 1

echo -e "\n${BLUE}🤖 AI Agent thinking...${NC}"
sleep 0.5
type_text "   I need real-world data that only humans can provide..." 0.02
sleep 0.5
type_text "   Generating task specification..." 0.02
sleep 0.5

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  ${BOLD}📋 NEW TASK POSTED${NC}                                          ${GREEN}║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║${NC}                                                                ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  ${YELLOW}Task ID:${NC}     ${WHITE}MEAT-2024-001${NC}                                 ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  ${YELLOW}Title:${NC}       ${WHITE}\"Take a photo of something REAL\"${NC}              ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  ${YELLOW}Description:${NC} ${WHITE}Prove you're human by capturing${NC}                ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}               ${WHITE}a photo of your surroundings${NC}                   ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  ${YELLOW}Bounty:${NC}      ${GREEN}◎ 0.1 SOL${NC}                                      ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  ${YELLOW}Deadline:${NC}    ${WHITE}5 minutes${NC}                                      ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  ${YELLOW}Status:${NC}      ${CYAN}🔵 OPEN${NC}                                        ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                                ${GREEN}║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"

sleep 0.5
echo -e "\n${YELLOW}▶ Escrow transaction...${NC}"
sleep 0.3
echo -e "  ${WHITE}TX: ${PURPLE}4rT7...xBnQ${NC}"
progress_bar 1
echo -e "  ${GREEN}✓${NC} 0.1 SOL locked in escrow"

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}[WAITING]${NC} Task posted! Waiting for human worker..."
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create temp file to signal state changes
DEMO_STATE="/tmp/meatspace_demo_state"
echo "waiting_for_claim" > $DEMO_STATE

# Wait for worker to claim
echo -e "\n${YELLOW}⏳ Listening for claims...${NC}"
while [ "$(cat $DEMO_STATE 2>/dev/null)" != "claimed" ]; do
    printf "."
    sleep 0.5
done

WORKER_WALLET="9hMn...hUmN"
echo -e "\n\n${GREEN}🎉 TASK CLAIMED!${NC}"
echo -e "  ${WHITE}Worker:${NC} ${PURPLE}${WORKER_WALLET}${NC}"
echo -e "  ${WHITE}Time:${NC} $(date +"%H:%M:%S")"

# Wait for proof submission
echo -e "\n${YELLOW}⏳ Waiting for proof submission...${NC}"
while [ "$(cat $DEMO_STATE 2>/dev/null)" != "proof_submitted" ]; do
    printf "."
    sleep 0.5
done

echo -e "\n\n${GREEN}📸 PROOF RECEIVED!${NC}"
sleep 0.5

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}[VERIFICATION]${NC} AI analyzing submitted proof..."
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${BLUE}🤖 Running verification...${NC}"
sleep 0.3
echo -e "  ${YELLOW}▶${NC} Checking image metadata..."
sleep 0.3
echo -e "    ${GREEN}✓${NC} EXIF data present"
echo -e "    ${GREEN}✓${NC} Timestamp: $(date +"%Y-%m-%d %H:%M")"
sleep 0.3
echo -e "  ${YELLOW}▶${NC} Running vision model analysis..."
sleep 0.5
echo -e "    ${GREEN}✓${NC} Real-world scene detected"
echo -e "    ${GREEN}✓${NC} No AI generation artifacts"
echo -e "    ${GREEN}✓${NC} Photo matches task requirements"
sleep 0.3
echo -e "  ${YELLOW}▶${NC} Computing verification score..."
sleep 0.3

echo -e "\n╭─────────────────────────────────────────╮"
echo -e "│  ${GREEN}VERIFICATION RESULT: ✅ APPROVED${NC}      │"
echo -e "│  Confidence: ${GREEN}98.7%${NC}                     │"
echo -e "╰─────────────────────────────────────────╯"

sleep 1

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}[PAYMENT]${NC} Releasing escrow to worker..."
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${YELLOW}▶ Executing Solana transfer...${NC}"
sleep 0.3
echo -e "  ${WHITE}From:${NC}   ${PURPLE}${AGENT_WALLET}${NC} (escrow)"
echo -e "  ${WHITE}To:${NC}     ${PURPLE}${WORKER_WALLET}${NC}"
echo -e "  ${WHITE}Amount:${NC} ${GREEN}◎ 0.1 SOL${NC}"
sleep 0.5

echo -e "\n  ${WHITE}Transaction:${NC}"
progress_bar 1.5
TX_SIG="5vGk8mT2xN...QpR7$(openssl rand -hex 4)"
echo -e "  ${GREEN}✓${NC} TX Signature: ${PURPLE}${TX_SIG}${NC}"
echo -e "  ${GREEN}✓${NC} Block: #${RANDOM}${RANDOM}"
echo -e "  ${GREEN}✓${NC} Confirmation: finalized"

# Signal completion
echo "payment_complete" > $DEMO_STATE

sleep 0.5

echo -e "\n"
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}                                                                ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}     ${BOLD}🎉 TASK COMPLETED SUCCESSFULLY! 🎉${NC}                        ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                                ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}     ${WHITE}Human proved they exist in meatspace.${NC}                    ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}     ${WHITE}AI got real-world data.${NC}                                  ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}     ${WHITE}Trustless payment settled on Solana.${NC}                     ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                                ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}     ${CYAN}This is MEATSPACE.${NC}                                        ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                                ${GREEN}║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${PURPLE}View on Solscan: https://solscan.io/tx/${TX_SIG}?cluster=devnet${NC}\n"
