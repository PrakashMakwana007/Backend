class ApiResponse {
    constructor(
        statusCode = 200 ,
        meseage= 'Success',
        data 
    )
    {
        this.statusCode = statusCode;
        this.meseage = meseage;
        this.data = data;
    }
}