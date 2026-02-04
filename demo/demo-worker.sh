#!/bin/bash
# MEATSPACE Demo - Human Worker Script
# Claims task, submits proof

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'
BOLD='\033[1m'

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

DEMO_STATE="/tmp/meatspace_demo_state"

clear

echo -e "${BLUE}"
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
║              👤 HUMAN WORKER TERMINAL 👤                         ║
╚══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

sleep 1

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}[SYSTEM]${NC} MEATSPACE Worker Client v0.1.0"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
sleep 0.5

WORKER_WALLET="9hMn...hUmN"
echo -e "\n${YELLOW}▶ Connecting wallet...${NC}"
sleep 0.3
echo -e "  ${GREEN}✓${NC} Phantom wallet connected"
echo -e "  ${GREEN}✓${NC} Worker address: ${PURPLE}${WORKER_WALLET}${NC}"
echo -e "  ${GREEN}✓${NC} Balance: ${GREEN}0.05 SOL${NC}"

sleep 0.5

echo -e "\n${YELLOW}▶ Fetching available tasks...${NC}"
sleep 0.5

echo -e "\n${WHITE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${WHITE}║${NC}  ${BOLD}📋 AVAILABLE TASKS${NC}                                           ${WHITE}║${NC}"
echo -e "${WHITE}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${WHITE}║${NC}                                                                ${WHITE}║${NC}"
echo -e "${WHITE}║${NC}  ${CYAN}[1]${NC} ${BOLD}MEAT-2024-001${NC}                                          ${WHITE}║${NC}"
echo -e "${WHITE}║${NC}      ${WHITE}\"Take a photo of something REAL\"${NC}                        ${WHITE}║${NC}"
echo -e "${WHITE}║${NC}      ${GREEN}◎ 0.1 SOL${NC} │ ${YELLOW}⏱ 5 min${NC} │ ${CYAN}🔵 OPEN${NC}                       ${WHITE}║${NC}"
echo -e "${WHITE}║${NC}                                                                ${WHITE}║${NC}"
echo -e "${WHITE}╚════════════════════════════════════════════════════════════════╝${NC}"

sleep 1

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}[ACTION]${NC} Claiming task..."
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${YELLOW}Press ENTER to claim task MEAT-2024-001...${NC}"
read -r

echo -e "\n${YELLOW}▶ Signing claim transaction...${NC}"
sleep 0.3
echo -e "  ${WHITE}TX: ${PURPLE}3kP9...cLaM${NC}"
progress_bar 0.8
echo -e "  ${GREEN}✓${NC} Task claimed successfully!"

# Signal to agent
echo "claimed" > $DEMO_STATE

sleep 0.5

echo -e "\n${GREEN}╭─────────────────────────────────────────╮${NC}"
echo -e "${GREEN}│${NC}  ${BOLD}✅ TASK CLAIMED${NC}                        ${GREEN}│${NC}"
echo -e "${GREEN}│${NC}  You have 5 minutes to submit proof    ${GREEN}│${NC}"
echo -e "${GREEN}╰─────────────────────────────────────────╯${NC}"

sleep 1

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}${BOLD}[SUBMISSION]${NC} Submit proof of completion"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${WHITE}Task requirement: Take a photo of something REAL${NC}"
echo -e "\n${YELLOW}Press ENTER when you have your photo ready...${NC}"
read -r

echo -e "\n${YELLOW}▶ Uploading proof...${NC}"
sleep 0.3
echo -e "  ${WHITE}File:${NC} real_world_photo.jpg"
echo -e "  ${WHITE}Size:${NC} 2.4 MB"
echo -e "  ${WHITE}Hash:${NC} ${PURPLE}QmX7h...iPfS${NC} (IPFS)"
progress_bar 1.2

echo -e "\n${YELLOW}▶ Submitting proof to blockchain...${NC}"
sleep 0.3
echo -e "  ${WHITE}TX: ${PURPLE}7nS2...pRoF${NC}"
progress_bar 0.8
echo -e "  ${GREEN}✓${NC} Proof submitted!"

# Signal to agent
echo "proof_submitted" > $DEMO_STATE

sleep 0.5

echo -e "\n${YELLOW}╭─────────────────────────────────────────╮${NC}"
echo -e "${YELLOW}│${NC}  ${BOLD}📤 PROOF SUBMITTED${NC}                     ${YELLOW}│${NC}"
echo -e "${YELLOW}│${NC}  Waiting for AI verification...        ${YELLOW}│${NC}"
echo -e "${YELLOW}╰─────────────────────────────────────────╯${NC}"

echo -e "\n${YELLOW}⏳ AI is verifying your submission...${NC}"

# Wait for payment
while [ "$(cat $DEMO_STATE 2>/dev/null)" != "payment_complete" ]; do
    printf "."
    sleep 0.5
done

echo -e "\n"
sleep 0.5

echo -e "${GREEN}"
cat << 'EOF'
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║          💰💰💰 PAYMENT RECEIVED! 💰💰💰                         ║
║                                                                  ║
║                      ◎ 0.1 SOL                                   ║
║                                                                  ║
║          Your new balance: 0.15 SOL                              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${WHITE}You just got paid by an AI for doing something only humans can do.${NC}"
echo -e "${CYAN}Welcome to MEATSPACE. 🥩${NC}\n"
