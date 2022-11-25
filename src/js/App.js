import React, { useState, useEffect } from "react";

const App = () => {
  const [state, setState] = useState({
    inputTasks: [],
    tareasAPI: [
      {
        label: null,
        done: null,
      },
    ],
  });
  const urlApi = "https://assets.breatheco.de/apis/fake/todos/user/jorge";

  const getTasks = (urlApi) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(urlApi, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.msg) {
          postTask(urlApi);
        } else {
          setState((prevState) => {
            return { ...prevState, tareasAPI: result };
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const postTask = (urlApi) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify([]);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(urlApi, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.msg) {
          getTasks(urlApi);
        } else {
          getTasks(urlApi);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const putTasks = (urlApi, data) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(data),
      redirect: "follow",
    };

    fetch(urlApi, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getTasks(urlApi);
  }, []);

  const handleChangeInput = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      let task = {
        label: e.target.value,
        done: false,
      };
      let data = {
        tareasAPI: [...state.tareasAPI, task], //["tarea1", "tarea2", "tarea3", "nuevaTarea"],
      };
      setState((prevState) => {
        return { ...prevState, ...data };
      });
      putTasks(urlApi, [...state.tareasAPI, task]);
      e.target.value = "";
    }
  };

  const deleteTask = (e) => {
    console.log(e.target.id);
    let index = e.target.id;
    console.log(index);
    let data = state.tareasAPI;
    data.splice(e.target.id, 1);

    setState((prevState) => {
      return { ...prevState, tareasApi: data };
    });

    putTasks(urlApi, data);
  };

  const deleteAllTask = (e) => {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    fetch(urlApi, requestOptions)
      .then((response) => response.json())
      .then((result) => getTasks(urlApi))
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <div className="post-it">
          <h3 className="tdl">{`To-Do List de ${urlApi.replace(
            "https://assets.breatheco.de/apis/fake/todos/user/",
            ""
          )}`}</h3>
          <input
            type="text"
            placeholder="Presione enter"
            onKeyPress={handleChangeInput}
          />
          <ul>
            {state.tareasAPI.length > 0 ? (
              state.tareasAPI.map((elem, index, arr) => {
                return (
                  <li key={index}>
                    {elem.label}
                    <i
                      className="fas fa-trash-alt"
                      onClick={deleteTask}
                      id={index}
                    ></i>
                  </li>
                );
              })
            ) : (
              <li>No hay tareas Pendientes</li>
            )}
          </ul>
          <h5>Tareas pendientes: {state.tareasAPI.length}</h5>
          <button className="botondel" onClick={deleteAllTask}>Borre todas las tareas</button>
        </div>
      </div>
    </div>
  );
};

export default App;
