package BasicTCP;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.Socket;

public class TCPClient {

  public static void main(String[] args) throws Exception {
    String sentence = "";
    while (!sentence.toLowerCase().equals("exit")) {
      System.out.print("Enter something yo: ");
      BufferedReader inFromUser = new BufferedReader(new InputStreamReader(System.in));

      Socket clientSocket = new Socket("localhost", 6789);
      DataOutputStream outToServer = new DataOutputStream(clientSocket.getOutputStream());
      BufferedReader inFromServer = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));

      sentence = inFromUser.readLine();
      outToServer.writeBytes(sentence + '\n');
      String modifiedSentence = inFromServer.readLine();

      System.out.println("FROM SERVER: " + modifiedSentence);
      clientSocket.close();
    }

    System.out.println("Finished");
  }

}
