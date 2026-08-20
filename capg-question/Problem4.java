import java.util.*;
import java.util.stream.*;

class Product {

    private String name;
    private double price;

    Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

}

public class Problem4 {

    public static void main(String[] args) {

        List<Product> products = Arrays.asList(
                new Product("Laptop", 60000),
                new Product("Mouse", 500),
                new Product("Keyboard", 1500),
                new Product("Monitor", 12000)
        );

        Map<String, Double> map = products.stream()
                .collect(Collectors.toMap(
                        Product::getName,
                        Product::getPrice
                ));

        System.out.println(map);

    }

}
