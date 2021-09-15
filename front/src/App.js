import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";

const HOST_API = "http://localhost:8080/api";
const initialState = {
  list: [],
  item: {},
};
const Store = createContext(initialState);

const Form = () => {
  const formRef = useRef(null);
  const {
    dispatch,
    state: { item },
  } = useContext(Store);
  const [state, setState] = useState({ item });

  const onAdd = (event) => {
    event.preventDefault();
    const request = {
      name: state.name,
      id: null,
      completed: false,
    };

    fetch(HOST_API + "/todos", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  const onEdit = (event) => {
    event.preventDefault();
    const request = {
      name: state.name,
      id: item.id,
      completed: item.completed,
    };

    fetch(HOST_API + "/todos", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  return (
    <form ref={formRef}>
      <input
        type="text"
        name="name"
        defaultValue={item.name}
        required
        onChange={(event) => {
          setState({ ...state, name: event.target.value });
        }}
      ></input>
      {item.id && <button onClick={onEdit}>Actualizar</button>}
      {!item.id && <button onClick={onAdd}>Agregar</button>}
    </form>
  );
};

const Lists = () => {
  const { dispatch, state } = useContext(Store);

  const onDelete = (id) => {
    fetch(HOST_API + "/" + id + "/todos", {
      method: "DELETE",
    }).then((list) => {
      dispatch({ type: "delete-item", id });
    });
  };

  const markComplete = (todo) => { 
    const request = {
      name: todo.name,
      id: todo.id,
      completed: true,
    };
    fetch(HOST_API + "/todos", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        console.log(todo)
        dispatch({ type: "check-item", item: todo });
      });
  };

  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo });
  };

  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then((response) => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list });
      });
  }, [state.list.length, dispatch]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>¿Está completada?</td>
          </tr>
        </thead>
        <tbody>
          {state.list.map((todo, index) => {
            return (
              <tr key={index}>
                <td>{todo.id}</td>
                <td>{todo.name}</td>
                <td>{todo.completed === true ? "Si" : "No"}</td>
                <td>
                  <button onClick={() =>markComplete(todo)}> Completada </button>
                </td>
                <td>
                  <button onClick={() => onDelete(todo.id)}> Eliminar </button>
                </td>
                <td>
                  <button onClick={() => onEdit(todo)}> Editar </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function reducer(state, action) {
  switch (action.type) {
    case "update-list":
      return { ...state, list: action.list };
    case "add-item":
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList };
    case "detele-item":
      const listUpdate = state.list.filter((item) => {
        return item.id !== action.id;
      });
      return { ...state, list: listUpdate };
    case "edit-item":
      return { ...state, item: action.item };
    case "update-item":
      const listUpdateEdit = state.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      return { ...state, list: listUpdateEdit, item: {} };
    case "check-item":
      const listUpdateCheck = state.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      console.log(action.item)
      return { ...state, list: listUpdateCheck, item: {} };
    default:
      return state;
  }
}

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

function App() {
  return (
    <StoreProvider>
      <Form />
      <Lists />
    </StoreProvider>
  );
}

export default App;
