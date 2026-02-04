import {
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
} from '@solana/actions';
import { NextRequest, NextResponse } from 'next/server';
import { getTask, Task } from '@/lib/tasks';
import { MEATSPACE_URL } from '@/lib/constants';

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

function formatDescription(task: Task): string {
  const parts: string[] = [task.description];

  if (task.location?.city) {
    parts.push(`📍 ${task.location.city}`);
  }

  parts.push(`⏰ ${formatTimeRemaining(task.deadline)}`);

  if (task.workersNearby) {
    parts.push(`👥 ${task.workersNearby} workers nearby`);
  }

  return parts.join(' • ');
}

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const task = await getTask(params.taskId);

    if (!task || task.status !== 'open') {
      const errorResponse: ActionGetResponse = {
        type: 'action',
        icon: `${MEATSPACE_URL}/icon-error.png`,
        title: 'Task Not Available',
        description: task ? `This task is ${task.status}` : 'Task not found',
        label: 'Unavailable',
        disabled: true,
        links: {
          actions: [],
        },
      };
      return NextResponse.json(errorResponse, { headers: ACTIONS_CORS_HEADERS });
    }

    const response: ActionGetResponse = {
      type: 'action',
      icon: `${MEATSPACE_URL}/api/og/task/${task.id}.png`,
      title: `${getCategoryEmoji(task.category)} ${task.title}`,
      description: formatDescription(task),
      label: `Claim ($${task.bounty.amount} ${task.bounty.currency})`,
      disabled: false,
      links: {
        actions: [
          {
            label: `🎯 Claim ($${task.bounty.amount})`,
            href: `/api/actions/task/${task.id}/claim`,
            type: 'transaction',
          },
          {
            label: '📍 View on Map',
            href: `${MEATSPACE_URL}/task/${task.id}`,
            type: 'external-link',
          },
        ],
      },
    };

    return NextResponse.json(response, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: ACTIONS_CORS_HEADERS,
  });
}
