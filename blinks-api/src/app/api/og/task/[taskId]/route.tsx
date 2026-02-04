import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getTask } from '@/lib/tasks';

export const runtime = 'edge';

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    verification: '📸',
    delivery: '📦',
    inspection: '🔍',
    survey: '📋',
    mystery_shop: '🕵️',
    photography: '📷',
    data_collection: '📊',
    other: '📝',
  };
  return emojis[category] || '📝';
}

function formatTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff < 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d left`;
  if (hours > 0) return `${hours}h left`;

  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}m left`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  // Strip .png extension if present
  const taskId = params.taskId.replace(/\.png$/, '');
  const task = await getTask(taskId);

  if (!task) {
    // Return error image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            fontFamily: 'system-ui',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>🥩</div>
          <div style={{ fontSize: 32 }}>Task Not Found</div>
        </div>
      ),
      {
        width: 1200,
        height: 628,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f0f0f',
          padding: 60,
          fontFamily: 'system-ui',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          <span style={{ fontSize: 48, marginRight: 16 }}>🥩</span>
          <span
            style={{
              fontSize: 32,
              color: '#ff4444',
              fontWeight: 'bold',
              letterSpacing: 4,
            }}
          >
            MEATSPACE
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 48,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 24,
            lineHeight: 1.2,
          }}
        >
          {getCategoryEmoji(task.category)} {task.title}
        </div>

        {/* Location & Time */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            fontSize: 28,
            color: '#888888',
            marginBottom: 40,
          }}
        >
          {task.location?.city && (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              📍 {task.location.city}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center' }}>
            ⏰ {formatTimeRemaining(task.deadline)}
          </span>
        </div>

        {/* Bounty Box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            borderRadius: 24,
            padding: '40px 80px',
            marginTop: 'auto',
            marginBottom: 30,
            border: '3px solid #ff4444',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#00ff88',
            }}
          >
            💰 ${task.bounty.amount}
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#888888',
              marginTop: 8,
            }}
          >
            {task.bounty.currency}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 20,
            color: '#666666',
          }}
        >
          <span>
            {task.workersNearby
              ? `👥 ${task.workersNearby} workers nearby`
              : ''}
          </span>
          <span>meatspace.work</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
    }
  );
}
