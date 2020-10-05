import React from 'react';
import { Container } from 'reactstrap';
import { Plan } from './components/Plan';
import { Terraform } from './terraform';

export const App: React.FunctionComponent = () => {
  const [ planRepresentation, setPlanRepresentation ] = React.useState<Terraform.Plan>();

  const fetchPlan = async() => {
    const planResponse = await fetch('/plan.json');
    setPlanRepresentation(await planResponse.json() as Terraform.Plan);
  };

  React.useEffect(() => {
    fetchPlan();
  }, []);

  return (
    <Container fluid>
      <header>
        <h1>TF Summary</h1>
      </header>

      <main>
        {planRepresentation !== undefined
          ? <Plan representation={planRepresentation} />
          : null}
      </main>
    </Container>
  );
};
