
import { File } from '@asyncapi/generator-react-sdk'

export default function ({ asyncapi }) {

  return <File name="client.py">{asyncapi.info().title()}</File>
}