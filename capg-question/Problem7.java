import java.util.*;
import java.util.stream.*;

public class Problem7 {

    public static void main(String[] args) {

        List<String[]> list = Arrays.asList(
                new String[]{"Java", "Python"},
                new String[]{"C++", "C"},
                new String[]{"HTML", "CSS", "JavaScript"}
        );

        List<String> result = list.stream()
                .flatMap(Arrays::stream)
                .collect(Collectors.toList());

        System.out.println(result);
    }
}