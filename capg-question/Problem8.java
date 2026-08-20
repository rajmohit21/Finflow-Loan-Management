import java.util.*;
import java.util.stream.*;

public class Problem8 {

    public static void main(String[] args) {

        List<String> sentences = Arrays.asList(
                "Java is easy",
                "Java Stream API",
                "API is powerful",
                "Streams are useful"
        );

        List<String> words = sentences.stream()
                .flatMap(sentence -> Arrays.stream(sentence.split(" ")))
                .distinct()
                .collect(Collectors.toList());

        System.out.println(words);
    }
}