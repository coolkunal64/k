            this.stackProcessing = true;
146
            var params = this.stack[0];
147
            this.uploadFile(params[0], params[1], params[2], params[3], params[4], (err, resp) => {
148
                if (err) {
149
                    debug("Error processing stack: " + err);
150
                } else {
151
                    this.stack.splice(0, 1);
152
                    this.uploadStack();
153
                }
154
            });
155
        } else {
156
            this.stackProcessing = false;
157
        }
158
    }
159
    /**
160
     *Upload directory
161
     * Emits:
162
     *      'addSize':size
163
     */
164
    public uploadDir(folderPath, parentId?) {
165
        FILE.readdir(folderPath, (err, list) => {
166
            if (!err) {
167
                list.forEach((item) => {
168
                    FILE.lstat(path.join(folderPath, item), (e, stat) => {
169
                        this.emit("addSize", {
170
                            size: stat.size
171
                        });
172
                        if (!err) {
173
                            if (stat.isDirectory()) {
174
                                this.makeDir(item, (newParentId) => {
175
                                    this.uploadDir(path.join(folderPath, item), newParentId);
176
                                }, parentId);
177
                            } else {
178
                                var fullPath = path.join(folderPath, item);
179
                                var stream = FILE.createReadStream(fullPath);
180
                                //this.uploadFile(stream, stat.size, mime.lookup(fullPath), item, oauth2Client, parentId);
181
                                this.stack.push([stream, stat.size, mime.lookup(fullPath), item, parentId]);
182
                                if (!this.stackProcessing) {
183
                                    //stack not running
184
                                    this.uploadStack();
185
                                }
186
                            }
187
                        } else {
188
                            debug(err);
189
                        }
190
                    });
191
                });
192
            } else {
193
                debug(err);
194
            }
195
        });
196
    }
197
}
