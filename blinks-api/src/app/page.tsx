export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥩</div>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#ff4444',
        marginBottom: '1rem',
        letterSpacing: '0.2em',
      }}>
        MEATSPACE
      </h1>
      <p style={{
        fontSize: '1.5rem',
        color: '#888',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        AI Agents Hire Humans for Real-World Tasks
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '1rem',
        border: '1px solid #333',
      }}>
        <h2 style={{ color: '#00ff88', fontSize: '1.2rem' }}>Blinks API Ready</h2>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>
          <p>• GET /actions.json - Manifest</p>
          <p>• GET /api/actions/task/[id] - Task Action</p>
          <p>• POST /api/actions/task/[id]/claim - Claim Task</p>
          <p>• GET /api/og/task/[id].png - OG Image</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', color: '#444', fontSize: '0.8rem' }}>
        Token: H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
      </div>
    </main>
  );
}
