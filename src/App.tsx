import React from 'react';
import { Plan, PlanRepresentation } from './components/Plan';
import { Container } from 'reactstrap';

export const App: React.FunctionComponent = () => {
  const [ planRepresentation, setPlanRepresentation ] = React.useState<PlanRepresentation>();

  const fetchPlan = async() => {
    const planResponse = await fetch('/plan.json');
    setPlanRepresentation(await planResponse.json() as PlanRepresentation);
  };

  console.log(planRepresentation);

  React.useEffect(() => {
    fetchPlan();
  }, []);

  return (
    <div>
      <header>
        <h1>TF Summary</h1>
      </header>

      <main>
        <Container fluid>
          {planRepresentation !== undefined ? <Plan representation={planRepresentation} /> : null}
        </Container>
      </main>
    </div>
  );
};
