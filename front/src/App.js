import React, {createContext, useContext, useReducer, useEffect, useRef, useState} from 'react'

const HOST_API = "http://localhost:8080/api"
const initialState = {
  list:[]
};
const Store = createContext(initialState)
 
const Form = () => {
  const formRef = useRef(null);
  const { state1, dispatch } = useContext(Store);
  const [state, setState] = useState({});

  const onAdd = (event) => {
    event.preventDefault();
    const request = {
      name: state.name,
      id: null, 
      isComplete: false
    };

    fetch(HOST_API+"/todos",{
      method:"POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((todo)=>{
      dispatch({type: "add-item",item:todo});
      console.log(state1)
      setState({name:""});
      formRef.current.reset();
    });
  }

  return(
    <form ref={formRef} onSubmit={onAdd}>
      <input type="text" name="name" required onChange={(event)=>{
        setState({...state,name: event.target.value})
      }}
      ></input>
      <button type="submit">Agregar</button>
    </form>
  )
}


const Lists = () => {

  const { dispatch, state } = useContext(Store);
  
  const onDelete = () => {
    const request = {
      name: null,
      id: state.id, 
      isComplete: false
    };
    fetch(HOST_API+"/todos",{
      method:"POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((todo)=>{
      dispatch({type: "add-item",item:todo});
      console.log(state1)
      setState({name:""});
      formRef.current.reset();
    });
  }

  useEffect(() => {
    fetch(HOST_API+"/todos")
      .then(response => response.json())
      .then((list) => {
        dispatch({type:"update-list",list})
      })
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
          {state.list.map((todo,index)=> {
            return(
              <tr key={index}>
                <td>{todo.id}</td>
                <td>{todo.name}</td>
                <td>{todo.isComplete}</td>
                <td>
                  <button onClick={onDelete}> Eliminar </button>
                </td>
              </tr>
            )})}
        </tbody>
      </table>
    </div>
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'update-list':
      return {...state, list: action.list}
      case 'add-item':
        const newList = state.list;
        newList.push(action.item);
        return {...state, list: newList}
        break;
    default:
      return state
  }
}

const StoreProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return ( 
    <Store.Provider value={{state,dispatch}} >
      {children}
    </Store.Provider>
   );
}
 
function App() {
  return ( 
  <StoreProvider>
    <Form/>
    <Lists/>
  </StoreProvider>
  );
}

export default App;
