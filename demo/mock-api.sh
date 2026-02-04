#!/bin/bash
# MEATSPACE Mock API Server
# Simulates backend responses for offline demo

set -e

PORT=${1:-8080}

echo "🥩 MEATSPACE Mock API starting on port $PORT..."

# Simple HTTP response helper using netcat
respond() {
    local body="$1"
    local length=${#body}
    echo -e "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: $length\r\n\r\n$body"
}

# Mock task
TASK_JSON='{
  "id": "MEAT-2024-001",
  "title": "Take a photo of something REAL",
  "description": "Prove you exist in meatspace by capturing a photo of your surroundings",
  "bounty": 0.1,
  "currency": "SOL",
  "status": "open",
  "creator": "7xKp3mT2xNqR7...mEaT",
  "deadline": "2024-01-15T12:00:00Z",
  "escrow_tx": "4rT7kP9mN2xS...xBnQ"
}'

# Mock claim response
CLAIM_JSON='{
  "success": true,
  "task_id": "MEAT-2024-001",
  "worker": "9hMn5vGk8mT2...hUmN",
  "claimed_at": "2024-01-15T11:30:00Z",
  "claim_tx": "3kP9vGk8mT2...cLaM"
}'

# Mock proof submission response
PROOF_JSON='{
  "success": true,
  "task_id": "MEAT-2024-001",
  "proof_hash": "QmX7h3kP9mN2...iPfS",
  "submitted_at": "2024-01-15T11:35:00Z",
  "proof_tx": "7nS2kP9mN2x...pRoF"
}'

# Mock verification response
VERIFY_JSON='{
  "success": true,
  "task_id": "MEAT-2024-001",
  "verification": {
    "approved": true,
    "confidence": 0.987,
    "checks": {
      "exif_present": true,
      "timestamp_valid": true,
      "real_world_detected": true,
      "no_ai_artifacts": true,
      "meets_requirements": true
    }
  }
}'

# Mock payment response
PAYMENT_JSON='{
  "success": true,
  "task_id": "MEAT-2024-001",
  "payment": {
    "from": "7xKp3mT2xNqR7...mEaT",
    "to": "9hMn5vGk8mT2...hUmN",
    "amount": 0.1,
    "currency": "SOL",
    "tx_signature": "5vGk8mT2xN3kP9...QpR7",
    "block": 245789123,
    "status": "finalized"
  }
}'

echo "Mock endpoints:"
echo "  GET  /tasks           - List available tasks"
echo "  POST /tasks/:id/claim - Claim a task"
echo "  POST /tasks/:id/proof - Submit proof"
echo "  POST /tasks/:id/verify - Verify proof"
echo "  POST /tasks/:id/pay   - Release payment"
echo ""
echo "Press Ctrl+C to stop"

# Simple request handler (if you have a proper server, use that instead)
while true; do
    # This is a placeholder - in practice you'd use a real HTTP server
    # For demo, the scripts just print mock responses
    sleep 1
done
