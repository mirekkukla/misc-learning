package WebServer;

import java.net.ServerSocket;
import java.net.Socket;

public class WebServer {

  public static void main(String[] args) throws Exception {
    final int port = 6789;
    ServerSocket welcomeSocket = new ServerSocket(port);

    while (true) {
      // Listen for a TCP connection request.
      System.out.println("Listening...");
      Socket connectionSocket = welcomeSocket.accept();

      // Construct an object to process the HTTP request message, start in new thread
      HttpRequest request = new HttpRequest(connectionSocket);
      Thread thread = new Thread(request);
      thread.start();
    }
  }

}
