import { ActionGetResponse, ACTIONS_CORS_HEADERS } from '@solana/actions';
import { NextRequest, NextResponse } from 'next/server';
import { listTasks } from '@/lib/tasks';
import { MEATSPACE_URL } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const near = searchParams.get('near');
    const category = searchParams.get('category');

    const tasks = await listTasks({
      status: 'open',
      category: category || undefined,
      limit: 5,
    });

    const locationText = near || 'your area';

    const description = tasks.length > 0
      ? tasks
          .slice(0, 3)
          .map((t) => `• $${t.bounty.amount} - ${t.title}`)
          .join('\n') + (tasks.length > 3 ? `\n+${tasks.length - 3} more` : '')
      : 'No tasks available in your area right now.';

    const response: ActionGetResponse = {
      type: 'action',
      icon: `${MEATSPACE_URL}/api/og/feed.png`,
      title: `🥩 Tasks Near ${locationText}`,
      description,
      label: 'Browse Tasks',
      disabled: tasks.length === 0,
      links: {
        actions: tasks.slice(0, 3).map((task) => ({
          label: `🎯 $${task.bounty.amount} - ${task.title.slice(0, 30)}...`,
          href: `/api/actions/task/${task.id}`,
          type: 'action' as const,
        })),
      },
    };

    return NextResponse.json(response, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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
