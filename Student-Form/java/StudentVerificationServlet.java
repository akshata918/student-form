public class StudentVerificationServlet extends SlingAllMethodsServlet {
    
    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        String name = request.getParameter("name");
        String age = request.getParameter("age");
        String flavor = request.getParameter("flavor");
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        boolean isExistingUser = checkIfUserExists(name);
        
        JsonObject jsonResponse = new JsonObject();
        
        if (isExistingUser) {
            jsonResponse.addProperty("error", "User alredy exists.");
        } else {
            String couponCode = generateCouponCode();
            jsonResponse.addProperty("couponCode", couponCode);
        }
        
        response.getWriter().write(jsonResponse.toString());
    }

    //Assuming the user profile is in a API response
    private boolean checkIfUserExists(String name) {
        boolean userExists = false;
    
        String apiUrl = "https://api.example.com/users?name=" + name;

        try {
            CloseableHttpClient httpClient = HttpClients.createDefault()
            HttpGet request = new HttpGet(apiUrl);
            
            CloseableHttpResponse response = httpClient.execute(request)
            int statusCode = response.getStatusLine().getStatusCode();

            if (statusCode == 200) {
                userExists = true;
            } else {
                log.error("Error: API returned status code " + statusCode);
            }
            
        } catch (IOException e) {
            log.error("Error during API request", e);
        }

        return userExists;
    }

    private String generateCouponCode() {
        return "COUPON-1234";
    }
}