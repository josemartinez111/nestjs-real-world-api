/** user.decorator.ts */
import { createParamDecorator, ExecutionContext } from "@nestjs/common"
// ⚫️⚫️☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰

export const UserDecorator = createParamDecorator(
(data: any, context: ExecutionContext) => {
	//..........
	const request = context.switchToHttp().getRequest()
	if (!request.user) return null
	if (data) return request.user[data]
	
	return request.user
})
// ⚫️⚫️☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰
