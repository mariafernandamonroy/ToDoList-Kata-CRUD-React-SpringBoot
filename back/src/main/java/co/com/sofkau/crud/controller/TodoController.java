package co.com.sofkau.crud.controller;

import co.com.sofkau.crud.entities.Todo;
import co.com.sofkau.crud.services.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;

@RestController
@CrossOrigin(origins= "http://localhost:3000/")
public class TodoController {

    @Autowired
    private TodoService service;

    @GetMapping(value = "api/todos")
    public Iterable<Todo> list(){
        return service.list();
    }

    @PostMapping(value = "api/todos")
    public Todo save(@RequestBody Todo todo){
        return service.save(todo);
    }

    @PutMapping(value = "api/todos")
    public Todo update(@RequestBody Todo todo){
        if(todo.getId() != null){
            return service.save(todo);
        }
        throw new RuntimeException("No existe el id para actualizar");
    }

    @DeleteMapping(value = "api/{id}/todos")
    public void delete(@PathParam("id") Long id){
        service.delete(id);
    }

    @GetMapping(value = "api/{id}/todos")
    public Todo get(@PathParam("id") Long id){
        return service.get(id);
    }
}
