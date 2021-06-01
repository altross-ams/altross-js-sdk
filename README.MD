#### Altross Javascript SDK

## Basic Usage

```js
import Permissions from "altross"

const permissions = new Permissions(process.env.ALTROSS_TOKEN)

await permissions.init()

await permissions.isActive(process.env.USER_ID,process.env.FEATURE_ID)
```