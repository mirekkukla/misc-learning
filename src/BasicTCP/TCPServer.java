package BasicTCP;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;


public class TCPServer {

  public static void main(String[] args) throws Exception {
    ServerSocket welcomeSocket = new ServerSocket(6789);

    while (true) {
      System.out.print("Listening...");
      Socket connectionSocket = welcomeSocket.accept();
      BufferedReader inFromClient = new BufferedReader(new InputStreamReader(connectionSocket.getInputStream()));
      DataOutputStream outToClient = new DataOutputStream(connectionSocket.getOutputStream());

      String clientSentence = inFromClient.readLine();
      String capitalizedSentence = clientSentence.toUpperCase();
      outToClient.writeBytes(capitalizedSentence + '\n');
      System.out.print("Done!");
    }
  }

}
