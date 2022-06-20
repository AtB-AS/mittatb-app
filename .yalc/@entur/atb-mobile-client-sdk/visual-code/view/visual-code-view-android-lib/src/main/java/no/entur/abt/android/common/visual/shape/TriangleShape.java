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

public class TriangleShape extends Shape {
	@Override
	public final void draw(final Canvas canvas, final Paint paint) {
		Path path;

		path = new Path();
		path.moveTo(0, getHeight());
		path.lineTo(getWidth(), getHeight());
		path.lineTo(getWidth() / 2, 0);
		path.lineTo(0, getHeight());
		canvas.drawPath(path, paint);
	}

}
