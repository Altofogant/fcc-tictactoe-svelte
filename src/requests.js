export const nextMove = async (space) => {
    try {
        const response = await fetch(`${process.env.apiUrl}/next-turn/${space}`);
        const message = await response.json();
    
        return message.errorMessage;
    } catch (e) {
        console.log(e, 'error connecting to the server')
    };
};