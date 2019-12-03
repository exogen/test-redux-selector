import React from "react";
import ReactDOM from "react-dom";
import { Provider, useSelector } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { createSelector } from "reselect";
import App from "./App";

const getValueString = createSelector(
  state => state.value,
  value => `value = ${value}`
);

function TestComponent() {
  const value = useSelector(state => state.value);
  const valueString = useSelector(getValueString);
  const valueStringFresh = useSelector(state => getValueString(state));
  console.log({ value, valueString, valueStringFresh });
  return (
    <span>
      Actual value: {value}
      Memoized selector value: {valueString}
      Fresh selector value: {valueStringFresh}
    </span>
  );
}

it("renders consistent Redux state", () => {
  const createStore = configureStore([]);
  const initialStore = createStore({ value: 1 });
  const updatedStore = createStore({ value: 5 });

  const { container, rerender } = render(
    <Provider store={initialStore}>
      <TestComponent />
    </Provider>
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span>
        Actual value: 
        1
        Memoized selector value: 
        value = 1
        Fresh selector value: 
        value = 1
      </span>
    </div>
  `);

  rerender(
    <Provider store={updatedStore}>
      <TestComponent />
    </Provider>
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span>
        Actual value: 
        5
        Memoized selector value: 
        value = 5
        Fresh selector value: 
        value = 5
      </span>
    </div>
  `);
});
