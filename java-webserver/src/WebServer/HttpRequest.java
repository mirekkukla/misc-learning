package WebServer;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.util.StringTokenizer;

final class HttpRequest implements Runnable {
  final static String CRLF = "\r\n";
  private final Socket socket;

  public HttpRequest(Socket socket) throws Exception {
    this.socket = socket;
  }

  @Override
  public void run() {
    try {
      processRequest();
    } catch (Exception e) {
      System.out.println(e);
    }
  }

  private void processRequest() throws Exception {
    // Get a reference to the socket's input and output streams
    InputStreamReader is = new InputStreamReader(socket.getInputStream());
    DataOutputStream os = new DataOutputStream(socket.getOutputStream());
    BufferedReader br = new BufferedReader(is);

    // Get and display the request line of the HTTP request message
    String requestLine = br.readLine();
    System.out.println("\n" + requestLine);

    // Get and display the header lines
    String headerLine = null;
    while ((headerLine = br.readLine()).length() != 0) {
      System.out.println(headerLine);
    }
    System.out.println();

    // Extract the filename from the request line.
    StringTokenizer tokens = new StringTokenizer(requestLine);
    tokens.nextToken(); // skip over the method, which should be "GET"
    String fileName = tokens.nextToken();
    // fileName = "." + fileName; // so that file request is within the current directory.

    // Open the requested file.
    FileInputStream fis = null;
    boolean fileExists = true;
    try {
      fis = new FileInputStream(fileName);
    } catch (FileNotFoundException e) {
      fileExists = false;
    }

    // Construct the response message.
    String statusLine = null;
    String contentTypeLine = null;
    String fileNotFoundBody = "<HTML>" +
        "<HEAD><TITLE>Not Found</TITLE></HEAD>" +
        "<BODY>File Not Found Bro!</BODY></HTML>";

    if (fileExists) {
      statusLine = "HTTP/1.0 200 OK" + CRLF;
      contentTypeLine = "Content-type: " + contentType(fileName) + CRLF;
    } else {
      statusLine = "HTTP/1.0 404 Not Found" + CRLF;
      contentTypeLine = "Content-type: text/html" + CRLF;
    }

    // Send the status line and header
    os.writeBytes(statusLine);
    os.writeBytes(contentTypeLine);
    os.writeBytes(CRLF);

    // Send the body
    if (fileExists) {
      sendBytes(fis, os);
      fis.close();
    } else {
      os.writeBytes(fileNotFoundBody);
    }

    os.close();
    br.close();
    socket.close();
  }

  private static void sendBytes(FileInputStream fis, OutputStream os) throws Exception {
    // Construct a 1K buffer to hold bytes on their way to the socket.
    byte[] buffer = new byte[1024];
    int bytes = 0;

    // Copy requested file into the socket's output stream.
    while ((bytes = fis.read(buffer)) != -1) {
      os.write(buffer, 0, bytes);
    }
  }

  private static String contentType(String fileName) {
    if (fileName.endsWith(".htm") || fileName.endsWith(".html")) {
      return "text/html";
    } else {
      return "application/octet-stream";
    }
  }

}
