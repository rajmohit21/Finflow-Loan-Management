import java.util.*;
import java.util.stream.*;

class Employee {

    private int id;
    private String name;
    private String department;

    Employee(int id, String name, String department) {

        this.id = id;
        this.name = name;
        this.department = department;

    }

    public String getDepartment() {

        return department;

    }

}

public class Problem5 {

    public static void main(String[] args) {

        List<Employee> employees = Arrays.asList(

                new Employee(1, "Rahul", "IT"),
                new Employee(2, "Priya", "HR"),
                new Employee(3, "Neha", "IT"),
                new Employee(4, "Amit", "Finance"),
                new Employee(5, "Kiran", "HR")

        );

        List<String> departments = employees.stream()
                .map(Employee::getDepartment)
                .distinct()
                .collect(Collectors.toList());

        System.out.println(departments);

    }

}