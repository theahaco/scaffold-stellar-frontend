import { Layout, ThemeSwitch } from "@stellar/design-system";
import { Button, Input } from "@stellar/design-system";

function App() {
  return (
    <>
    <Layout.Header 
      disableSetThemeOnLoad
      projectId="Design System"
      projectTitle="Design System"
    />
    <Layout.Content>
      Hi
    </Layout.Content>
      <ThemeSwitch />


      <Button
        size="sm"
        variant="primary"
      >
        Button
      </Button>
      <Layout.Footer />
    </>
  );
}

export default App;
