import "./start.css";

function Start({ onStart }) {
  return (
    <main className="startScreen">
      <div className="startScreen__grain" aria-hidden="true" />
      <div className="startScreen__content">
        <button type="button" className="startScreen__button" onClick={onStart}>
          <span className="startScreen__buttonText">Start</span>
          <span className="startScreen__buttonIcon" aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  );
}

export default Start;