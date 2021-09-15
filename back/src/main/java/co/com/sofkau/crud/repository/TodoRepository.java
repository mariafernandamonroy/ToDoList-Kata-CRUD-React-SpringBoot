package co.com.sofkau.crud.repository;

import co.com.sofkau.crud.entities.Todo;
import org.springframework.data.repository.CrudRepository;

public interface TodoRepository extends CrudRepository<Todo,Long> {

}
