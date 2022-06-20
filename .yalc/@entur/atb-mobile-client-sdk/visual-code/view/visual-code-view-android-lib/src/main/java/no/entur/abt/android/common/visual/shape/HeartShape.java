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
import android.graphics.PointF;
import android.graphics.RectF;
import android.graphics.drawable.shapes.Shape;

public class HeartShape extends Shape {

	private final int INVALID_SIZE = -1;

	private Path mPath = new Path();
	private RectF mRectF = new RectF();

	private float mOldWidth = INVALID_SIZE;
	private float mOldHeight = INVALID_SIZE;

	private float mScaleX, mScaleY;

	@Override
	public void draw(Canvas canvas, Paint paint) {
		canvas.save();
		canvas.scale(mScaleX, mScaleY);

		float width = mRectF.width();
		float height = mRectF.height();

		float halfWidth = width / 2;
		float halfHeight = height / 2;

		float stdDestX = 5 * width / 14;
		float stdDestY = 2 * height / 3;

		PointF point1 = new PointF(stdDestX, 0);
		PointF point2 = new PointF(0, height / 15);
		PointF point3 = new PointF(stdDestX / 5, stdDestY);
		PointF point4 = new PointF(stdDestX, stdDestY);

		// Starting point
		mPath.moveTo(halfWidth, height / 5);

		mPath.cubicTo(point1.x, point1.y, point2.x, point2.y, width / 28, 2 * height / 5);
		mPath.cubicTo(point3.x, point3.y, point4.x, point4.y, halfWidth, height);

		canvas.drawPath(mPath, paint);

		canvas.scale(-mScaleX, mScaleY, halfWidth, halfHeight);
		canvas.drawPath(mPath, paint);

		canvas.restore();
	}

	@Override
	protected void onResize(float width, float height) {
		mOldWidth = mOldWidth == INVALID_SIZE ? width : Math.max(1, mOldWidth);
		mOldHeight = mOldHeight == INVALID_SIZE ? height : Math.max(1, mOldHeight);

		width = Math.max(1, width);
		height = Math.max(1, height);

		mScaleX = width / mOldWidth;
		mScaleY = height / mOldHeight;

		mOldWidth = width;
		mOldHeight = height;

		mRectF.set(0, 0, width, height);
	}

}
