import api from "..";

class OpenApi {

  getOpenApi() {
    return api.get('/open-crm-api') 
  }

}

const openApi = new OpenApi();

export default openApi
