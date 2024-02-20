import React from "react";
import styled from "styled-components";

// On crée un style css avec styled-components
const StyledHome = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
`;

function Home() {
  return (
    <StyledHome>
      <h1>Hello world</h1>
      <p>C'est une template</p>
    </StyledHome>
  );
}

export default Home;
