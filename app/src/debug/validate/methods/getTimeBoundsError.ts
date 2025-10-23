import { type TimeBoundsValue } from "../../types/types"
import { isEmptyObject } from "../../util/isEmptyObject"
import { sanitizeObject } from "../../util/sanitizeObject"
import { getPositiveIntError } from "./getPositiveIntError"

export const getTimeBoundsError = ({ min_time, max_time }: TimeBoundsValue) => {
	const validated = sanitizeObject({
		min_time: min_time
			? getPositiveIntError(min_time.toString())
			: (false as const),
		max_time: max_time
			? getPositiveIntError(max_time.toString())
			: (false as const),
	})

	return isEmptyObject(validated) ? false : validated
}
