package adj.demo.server.modules.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; // Importa Optional si no estaba ya

@RestController
@RequestMapping("/api/users")// La URL base para este controlador
@CrossOrigin({"*"})
public class UserController {

    @Autowired
    private UserService userService;

    // GET (Obtener todos)
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // --- MÉTODO AÑADIDO ---
    // GET (Obtener uno por ID)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> userOptional = userService.getUserById(id);

        // Comprueba si el usuario fue encontrado
        if (userOptional.isPresent()) {
            // Si existe, devuelve 200 OK con el usuario en el cuerpo
            return ResponseEntity.ok(userOptional.get());
        } else {
            // Si no existe, devuelve 404 Not Found
            return ResponseEntity.notFound().build();
        }

    }



    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }


    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        // Asumiendo que tu método service lanza una excepción si no lo encuentra
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
