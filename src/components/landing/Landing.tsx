interface LandingProps {
  onLaunch: () => void;
}

export function Landing({ onLaunch }: LandingProps) {
  return (
    <section className="pane">
      <div className="hero-grid">
        <div>
          <div className="hero-kicker">Casino landing · product-style</div>
          <h2 className="hero-title">
            Designed as a <span>portfolio-quality</span> Solana dApp.
          </h2>
          <p className="hero-subtitle">
            This frontend focuses on clean composition, responsive layout, and a clear game
            dashboard. Backend and contracts can be wired in later without changing the UX.
          </p>
          <div className="hero-cta">
            <button type="button" className="btn btn-primary" onClick={onLaunch}>
              Enter dashboard
            </button>
            <button type="button" className="btn btn-secondary">
              View frontend repo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
