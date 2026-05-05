import "./start.css";

function Start({ onStart }) {
  return (
    <main className="startScreen">
      <button type="button" className="startScreen__button" onClick={onStart}>
        Start
      </button>
    </main>
  );
}

export default Start;
