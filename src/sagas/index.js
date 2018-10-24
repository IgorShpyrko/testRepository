export function* helloSaga() {
  console.log('Hello Sagas!')
  yield console.log('next yield1')
  yield console.log('next yield2')
}