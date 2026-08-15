import './ScrollIndicator.css';

export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator" aria-hidden="true">
      <span className="scroll-line" />
      <span className="scroll-label">Scroll</span>
    </div>
  );
}
