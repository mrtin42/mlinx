'use server';

export default async function printToServer(input: any) {
    console.log(input)
    return `done`
}