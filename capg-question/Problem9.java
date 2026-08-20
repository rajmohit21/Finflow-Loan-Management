import java.util.*;
import java.util.stream.*;

class Item {

    private String name;

    Item(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

class Order {

    private List<Item> items;

    Order(List<Item> items) {
        this.items = items;
    }

    public List<Item> getItems() {
        return items;
    }
}

public class Problem9 {

    public static void main(String[] args) {

        List<Order> orders = Arrays.asList(

                new Order(Arrays.asList(
                        new Item("Laptop"),
                        new Item("Mouse")
                )),

                new Order(Arrays.asList(
                        new Item("Keyboard"),
                        new Item("Monitor")
                )),

                new Order(Arrays.asList(
                        new Item("Headphones"),
                        new Item("Speaker")
                ))

        );

        List<String> items = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .map(Item::getName)
                .collect(Collectors.toList());

        System.out.println(items);
    }
}