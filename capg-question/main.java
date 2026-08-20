//Extract names of employees earning more than average salary.
import java.util.*;
import java.util.stream.*;

class Employee {
    int id;
    String name;
    double salary;

    Employee(int id, String name, double salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }

    public double getSalary() {
        return salary;
    }

    public String getName() {
        return name;
    }
}

public class main {
    public static void main(String[] args) {

        List<Employee> employees = Arrays.asList(
                new Employee(1, "Rahul", 50000),
                new Employee(2, "Amit", 70000),
                new Employee(3, "Priya", 90000)
        );

        double avg = employees.stream()
                .collect(Collectors.averagingDouble(Employee::getSalary));

        List<String> result = employees.stream()
                .filter(e -> e.getSalary() > avg)
                .map(Employee::getName)
                .collect(Collectors.toList());

        System.out.println(result);
    }
}