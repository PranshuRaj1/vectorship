import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import Toast from './components/Toast';

function App() {
  return (
    <div className="app-container">
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
      <Toast />
    </div>
  );
}

export default App;
