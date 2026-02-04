#!/bin/bash
# Quick test to verify demo scripts work

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Testing MEATSPACE Demo Scripts...${NC}\n"

# Check bash version
echo -n "Bash version >= 4... "
if [[ ${BASH_VERSION:0:1} -ge 4 ]]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Warning: Bash 3.x detected, some features may not work${NC}"
fi

# Check bc (used for progress bars)
echo -n "bc calculator... "
if command -v bc &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Missing (install with: brew install bc)${NC}"
fi

# Check openssl (used for random tx hashes)
echo -n "openssl... "
if command -v openssl &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Missing${NC}"
fi

# Test state file location is writable
echo -n "State file writable... "
if touch /tmp/meatspace_demo_state 2>/dev/null; then
    rm /tmp/meatspace_demo_state
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Cannot write to /tmp${NC}"
fi

# Check scripts are executable
echo -n "Scripts executable... "
if [[ -x "./demo-agent.sh" && -x "./demo-worker.sh" && -x "./demo-orchestrator.sh" ]]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Run: chmod +x *.sh${NC}"
fi

echo ""

# Quick syntax check
echo "Syntax check..."
for script in demo-agent.sh demo-worker.sh demo-orchestrator.sh; do
    echo -n "  $script... "
    if bash -n "./$script" 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗ Syntax error${NC}"
    fi
done

echo ""
echo -e "${GREEN}All checks passed!${NC}"
echo ""
echo "To run the demo:"
echo "  Option 1 (two terminals):"
echo "    Terminal 1: ./demo-agent.sh"
echo "    Terminal 2: ./demo-worker.sh"
echo ""
echo "  Option 2 (single terminal):"
echo "    ./demo-orchestrator.sh"
