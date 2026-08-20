import java.util.*;
import java.util.stream.*;

public class Problem6 {

    public static void main(String[] args) {

        List<List<Integer>> numbers = Arrays.asList(

                Arrays.asList(1, 2, 3),
                Arrays.asList(4, 5),
                Arrays.asList(6, 7, 8)

        );

        List<Integer> result = numbers.stream()
                .flatMap(List::stream)
                .collect(Collectors.toList());

        System.out.println(result);

    }

}
