public import java.util.*;
import java.util.stream.*;

public class Problem10 {

    public static void main(String[] args) {

        Map<String, List<Integer>> map = new HashMap<>();

        map.put("A", Arrays.asList(1, 2, 3));
        map.put("B", Arrays.asList(4, 5));
        map.put("C", Arrays.asList(6, 7, 8));

        List<Integer> numbers = map.values()
                .stream()
                .flatMap(List::stream)
                .collect(Collectors.toList());

        System.out.println(numbers);

    }
} {
    
}
