import { DogIllustration } from "./DogIllustration.jsx";

export function PageTitle({ children }) {
  return (
    <div className="page-title">
      <h1>{children}</h1>
      <DogIllustration />
    </div>
  );
}
