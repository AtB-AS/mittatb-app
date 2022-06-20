package no.entur.abt.android.common.visual.shape;

/*-
 * #%L
 * Visual Inspection lib for android
 * %%
 * Copyright (C) 2019 Entur AS and original authors
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.drawable.shapes.Shape;

public class StarShape extends Shape {
	private int mNumVertices = 5;
	private float mInnerRadiusRatio = 0.3f;

	@Override
	public final void draw(final Canvas canvas, final Paint paint) {
		Path path = new Path();

		double radianPerPoint = Math.PI / mNumVertices;
		float halfWidth = getWidth() / 2;
		float halfHeight = getHeight() / 2;
		float halfInnerWidth = mInnerRadiusRatio * halfWidth;
		float halfInnerHeight = mInnerRadiusRatio * halfHeight;
		for (int i = 0; i < mNumVertices; ++i) {
			if (i == 0) {
				path.moveTo(halfWidth, 0);
			} else {
				path.lineTo(halfWidth + (float) Math.sin(2 * i * radianPerPoint) * halfWidth,
						halfHeight - (float) Math.cos(2 * i * radianPerPoint) * halfHeight);
			}
			path.lineTo(halfWidth + (float) Math.sin((2 * i + 1) * radianPerPoint) * halfInnerWidth,
					halfHeight - (float) Math.cos((2 * i + 1) * radianPerPoint) * halfInnerHeight);
		}

		canvas.drawPath(path, paint);
	}
}
