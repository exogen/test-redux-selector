import React, { useEffect, useState } from "react";
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
  const [foundInconsistency, setFoundInconsistency] = useState(false);

  console.log({ value, valueString, valueStringFresh });

  useEffect(() => {
    if (valueString !== valueStringFresh) {
      setFoundInconsistency(true);
    }
  }, [valueString, valueStringFresh]);

  return (
    <ul>
      <li>Actual value: {value}</li>
      <li>Memoized selector value: {valueString}</li>
      <li>Fresh selector value: {valueStringFresh}</li>
      <li>Found inconsistency? {foundInconsistency ? "true" : "false"}</li>
    </ul>
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
      <ul>
        <li>
          Actual value:
          1
        </li>
        <li>
          Memoized selector value:
          value = 1
        </li>
        <li>
          Fresh selector value:
          value = 1
        </li>
        <li>
          Found inconsistency?
          false
        </li>
      </ul>
    </div>
  `);

  rerender(
    <Provider store={updatedStore}>
      <TestComponent />
    </Provider>
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ul>
        <li>
          Actual value:
          5
        </li>
        <li>
          Memoized selector value:
          value = 5
        </li>
        <li>
          Fresh selector value:
          value = 5
        </li>
        <li>
          Found inconsistency?
          true
        </li>
      </ul>
    </div>
  `);
});
