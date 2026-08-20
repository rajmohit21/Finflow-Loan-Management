//Find Length of Longest String
import java.util.*;
import java.util.stream.Collectors;

public class Problem2 {

    public static void main(String[] args) {

        List<String> list = Arrays.asList(
                "Java",
                "Programming",
                "Stream",
                "API"
        );

        int longest = list.stream()
                .mapToInt(String::length)
                .max()
                .orElse(0);

        System.out.println("Longest Length = " + longest);
        //Convert List<String> to Map<String,Integer> Java
         Map<String, Integer> map = list.stream()
                .collect(Collectors.toMap(
                        s -> s,
                        String::length
                ));

        System.out.println(map);

    }
} 
    

